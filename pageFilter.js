import mongoose from 'mongoose'

export const pageFilter = async ( Shows, page = 1, pageSize = 20, filter) => {
  
  // if (filter === undefined) {
  //   filter = { type: type }
  // }

  const startIndex = (page -1) * pageSize
  const totalResults = await Shows.find( filter ).countDocuments()
  const resultsFind = await Shows.find( filter ).skip(startIndex).limit(pageSize).collation({ locale: 'en_US', strength: 1 })
  
  return { 
    pageSize: pageSize,
    page: page,
    maxPages: Math.ceil(totalResults/pageSize),
    totalShows: totalResults,
    results: resultsFind
  }

}