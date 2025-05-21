import { buildPaginationParams } from './http-params.util';

describe('buildPaginationParams', () => {
  test('debe retornar HttpParams con los valores correctos', () => {
    const params = buildPaginationParams(2, 10, true);
    expect(params.get('page')).toBe('2');
    expect(params.get('size')).toBe('10');
    expect(params.get('orderAsc')).toBe('true');
  });

  test('debe retornar orderAsc como "false" si se pasa false', () => {
    const params = buildPaginationParams(0, 5, false);
    expect(params.get('orderAsc')).toBe('false');
  });

  test('debe retornar orderAsc como "true" por defecto si no se pasa', () => {
    const params = buildPaginationParams(1, 20);
    expect(params.get('orderAsc')).toBe('true');
  });
});
