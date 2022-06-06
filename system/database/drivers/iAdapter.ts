/**
 * IAdapter interface
 */
export interface IAdapter {
  select($query);
  selectOne($query);

  insert($query);
  update($query);
  delete($query);

  statement($query);
}

