/**
 * IAdapter interface
 * @interface IAdapter
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export interface IAdapter {
  select($query);
  selectOne($query);

  insert($query);
  update($query);
  delete($query);

  statement($query);
}
