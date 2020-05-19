import mongoose from 'mongoose'

export const pageFilter = async ( Shows, page = 1, pageSize = 20, filter) => {

  const collation = { "locale": 'en_US', "strength": 1  };
  
  const startIndex = (page -1) * pageSize
  const totalResults = await Shows.find(filter).collation(collation).countDocuments()
  const resultsFind = await Shows.find(filter).collation(collation).skip(startIndex).limit(pageSize)
  
  return { 
    pageSize: pageSize,
    page: page,
    maxPages: Math.ceil(totalResults/pageSize),
    totalShows: totalResults,
    results: resultsFind
  }

}