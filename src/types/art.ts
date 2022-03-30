export type EditForm = {
  id: string
  cate_name: string
  cate_alias: string
}

export type AddForm = {
  cate_name: string
  cate_alias: string
}

export type ListForm = {
  title: string
  cate_id: string
  content: string
  state: string
  cover_img: string
}
