### djolar-searcher npm package 


~~~
Like django, djolar is a data query tool by (github.com/enix223).
~~~
### Example
~~~
  A list of users
    {
        id:     number
        name:   string
        age:    number
    }[]
  To query them with page 1 and 10 rows per page:
    const Query = `?limit=10&offset=0`
  To query them with filter(name must be 'linkjob')
    const Query = `?q=name__eq__linkjob`
  To query them with sort by id descend, age ascend
    const Query = `?s=-id,age`
  To query them where age must be greater than 15
    const Query = `?q=age__gt__15`
~~~

### Djolar returns
~~~
  The response data
    {
        count:  number
        result: Object[]
    }
  Property count is max of all data
  Property result is filtered and pagination parsed objects
~~~

### Searcher Usage
  Search with current pagination:
~~~
    import axios from 'axios';
    const searcher = new DjolarSearcher()
    searcher.searchOnly(axios, {}).then(...)
~~~

  Search next page with 30 rows per page:
~~~
    import axios from 'axios';
    const searcher = new DjolarSearcher({
        globalSearchOption: {
              pagination: {
                page: 1,
                rowsPerPage: 30,
              }
        }
    })
    searcher.searchWithPagination(axios, {
        pagination: {
            page: 2
        }
    }).then(...)
~~~



