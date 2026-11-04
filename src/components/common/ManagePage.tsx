import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { getErrorMessage } from '../../utils/formatters';
import type { Resource } from '../../api/services/resource';
import type { Row } from '../../types';
import Alert from './Alert';
import Button from './Button';
import ConfirmDialog from './ConfirmDialog';
import DataTable, { type Column } from './DataTable';
import { Input, Select, type Option } from './Input';
import Modal from './Modal';
import PageHeader from './PageHeader';
import QueryBoundary from './QueryBoundary';

export interface FieldDef {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'select';
  options?: Option[];
  required?: boolean;
  createOnly?: boolean;
}

interface ManagePageProps {
  title: string;
  description?: string;
  singular: string;
  resource: Resource<Row>;
  columns: Column<Row>[];
  fields: FieldDef[];
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  rowActions?: (row: Row, reload: () => void, notify: (type: 'error' | 'success', message: string) => void) => ReactNode;
}

type FormValues = Record<string, string>;

function toPayload(values: FormValues, fields: FieldDef[]): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  fields.forEach((f) => {
    const raw = values[f.name];
    if (raw === undefined || raw === '') return;
    payload[f.name] = f.type === 'number' ? Number(raw) : raw;
  });
  return payload;
}

export default function ManagePage({
  title,
  description,
  singular,
  resource,
  columns,
  fields,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  rowActions,
}: ManagePageProps) {
  const { data, loading, error, reload } = useFetch(() => resource.list());
  const [editing, setEditing] = useState<Row | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormValues>();

  const notify = (type: 'error' | 'success', message: string) => setNotice({ type, message });

  const openForm = (row: Row | null) => {
    setEditing(row);
    setFormError(null);
    reset(
      fields.reduce<FormValues>((acc, f) => {
        const value = row?.[f.name];
        acc[f.name] = value === undefined || value === null ? '' : String(value);
        return acc;
      }, {})
    );
    setFormOpen(true);
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const payload = toPayload(values, fields.filter((f) => !(editing && f.createOnly)));
      if (editing) await resource.update(editing.id, payload);
      else await resource.create(payload);
      setFormOpen(false);
      notify('success', `${singular} ${editing ? 'updated' : 'created'}.`);
      reload();
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  });

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await resource.remove(deleting.id);
      notify('success', `${singular} deleted.`);
      reload();
    } catch (err) {
      notify('error', getErrorMessage(err));
    } finally {
      setBusy(false);
      setDeleting(null);
    }
  };

  const actionColumn: Column<Row> = {
    key: '__actions',
    header: 'Actions',
    render: (row) => (
      <div className="no-print flex items-center gap-2">
        {rowActions?.(row, reload, notify)}
        {canEdit && (
          <button onClick={() => openForm(row)} aria-label="Edit" className="rounded p-1 text-gray-600 hover:bg-gray-100">
            <Pencil className="h-4 w-4" />
          </button>
        )}
        {canDelete && (
          <button onClick={() => setDeleting(row)} aria-label="Delete" className="rounded p-1 text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    ),
  };

  const showActions = canEdit || canDelete || Boolean(rowActions);

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          canCreate && (
            <Button onClick={() => openForm(null)}>
              <Plus className="h-4 w-4" />
              Add {singular.toLowerCase()}
            </Button>
          )
        }
      />
      <Alert type={notice?.type ?? 'success'} message={notice?.message ?? null} />
      <QueryBoundary loading={loading} error={error} onRetry={reload}>
        <DataTable columns={showActions ? [...columns, actionColumn] : columns} rows={data ?? []} />
      </QueryBoundary>

      <Modal open={formOpen} title={`${editing ? 'Edit' : 'Add'} ${singular.toLowerCase()}`} onClose={() => setFormOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Alert type="error" message={formError} />
          {fields
            .filter((f) => !(editing && f.createOnly))
            .map((f) =>
              f.type === 'select' ? (
                <Select
                  key={f.name}
                  label={f.label}
                  options={f.options ?? []}
                  error={formState.errors[f.name]?.message}
                  {...register(f.name, { required: f.required ? `${f.label} is required` : false })}
                />
              ) : (
                <Input
                  key={f.name}
                  label={f.label}
                  type={f.type ?? 'text'}
                  error={formState.errors[f.name]?.message}
                  {...register(f.name, { required: f.required ? `${f.label} is required` : false })}
                />
              )
            )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={formState.isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete ${singular.toLowerCase()}`}
        message="This cannot be undone."
        loading={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
