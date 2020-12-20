
# TEDTALKS BY KARIN 


## BASE URL
https://tedtalks-powered-by-mongo.herokuapp.com/


## TALKS
`https://tedtalks-powered-by-mongo.herokuapp.com/talks`

Listing all talks. To query for a specific talk, based on words present in each talk's "name" (ie. speaker first- and last name and title), type `?search={query}`.


## SINGLE TALK
`https://tedtalks-powered-by-mongo.herokuapp.com/talks/{id}`

To list a single talk add the individual ID to the endpoint. 


## SPEAKERS
`https://tedtalks-powered-by-mongo.herokuapp.com/speakers`

Listing all speakers.

`https://tedtalks-powered-by-mongo.herokuapp.com/speakers/{id}`

Listing selected speaker.

`https://tedtalks-powered-by-mongo.herokuapp.com/speakers/{id}/talks`

Listing talks by selected speaker.


## EVENTS
`https://tedtalks-powered-by-mongo.herokuapp.com/events`

Listing all events.

`https://tedtalks-powered-by-mongo.herokuapp.com/events/{id}`

Listing selected event.

`https://tedtalks-powered-by-mongo.herokuapp.com/events/{id}/talks`

Listing talks from selected event.


## CATEGORIES
`https://tedtalks-powered-by-mongo.herokuapp.com/categories`

Listing all categories.

`https://tedtalks-powered-by-mongo.herokuapp.com/categories/{category}/talks`

Listing all talks filtered by selected category.

----------------------------------------------------------------


##### Dataset source: 
https://www.kaggle.com/rounakbanik/ted-talks