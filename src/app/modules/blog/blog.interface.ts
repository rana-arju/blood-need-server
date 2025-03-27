export interface IBlog {
  id?: string
  title: string
  content: string
 userId: string
  image: string
  tags: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface IBlogFilters {
  searchTerm?: string
  userId?: string
  tags?: string[]
}

export interface IBlogWithAuthor extends IBlog {
  author: {
    id: string
    name: string
    email: string
    image?: string
  }
}

