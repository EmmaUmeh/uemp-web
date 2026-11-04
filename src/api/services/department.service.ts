import { ENDPOINTS } from '../endpoints';
import { createResource } from './resource';
import type { Row } from '../../types';

export const departmentService = createResource<Row>(ENDPOINTS.departments);
export const facultyService = createResource<Row>(ENDPOINTS.faculties);
export const programService = createResource<Row>(ENDPOINTS.programs);
export const periodService = createResource<Row>(ENDPOINTS.periods);
