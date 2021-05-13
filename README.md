# Mongo API Project

Replace this readme with your own information about your project. 

Start by briefly describing the assignment in a sentence or two. Keep it short and to the point.

## The problem

Describe how you approached to problem, and what tools and techniques you used to solve it. How did you plan? What technologies did you use? If you had more time, what would be next?

## View it live

Every project should be deployed somewhere. Be sure to include the link to the deployed project so that the viewer can click around and see what it's all about.


## API Documentation

  <body>
  <h1>Ticketmaster Events</h1>
    <div class="app-desc">This is a simpe API to find events that sells via Ticketmaster.</div>
    <div class="app-desc">More information: <a href="https://helloreverb.com">https://helloreverb.com</a></div>
    <div class="app-desc">Contact Info: <a href="pauline.j.andersson@gmail.com">pauline.j.andersson@gmail.com</a></div>
    <div class="app-desc">Version: 1.0.1</div>
    <div class="app-desc">BasePath:/Pauan86/Ticketmaster/1.0.1</div>
    <div class="license-info">Apache 2.0</div>
    <div class="license-url">http://www.apache.org/licenses/LICENSE-2.0.html</div>
  <h2>Access</h2>

  <h2><a name="__Methods">Methods</a></h2>
  [ Jump to <a href="#__Models">Models</a> ]

  <h3>Table of Contents </h3>
  <div class="method-summary"></div>
  <h4><a href="#Endpoints">Endpoints</a></h4>
  <ul>
  <li><a href="#rootGet"><code><span class="http-method">get</span> /</code></a></li>
  </ul>
  <h4><a href="#Events">Events</a></h4>
  <ul>
  <li><a href="#eventsGet"><code><span class="http-method">get</span> /events</code></a></li>
  <li><a href="#eventsSummer21Get"><code><span class="http-method">get</span> /events/summer21</code></a></li>
  </ul>
  <h4><a href="#SingleEvent">SingleEvent</a></h4>
  <ul>
  <li><a href="#eventsIdIdGet"><code><span class="http-method">get</span> /events/id/{id}</code></a></li>
  </ul>

  <h1><a name="Endpoints">Endpoints</a></h1>
  <div class="method"><a name="rootGet"></a>
    <div class="method-path">
    <a class="up" href="#__Methods">Up</a>
    <pre class="get"><code class="huge"><span class="http-method">get</span> /</code></pre></div>
    <div class="method-summary">Displays all endpoints for this API as links (<span class="nickname">rootGet</span>)</div>
    <div class="method-notes"></div>
   <h3 class="field-label">Return type</h3>
    <div class="return-type">
      array[<a href="#inline_response_200">inline_response_200</a>]
</div>
 <!--Todo: process Response Object and its headers, schema, examples -->
 <h3 class="field-label">Example data</h3>
    <div class="example-data-content-type">Content-Type: application/json</div>
    <pre class="example"><code>[ {
  "path" : "/events",
  "methods" : [ "GET" ],
  "middleware" : [ "anonymous" ]
}, {
  "path" : "/events",
  "methods" : [ "GET" ],
  "middleware" : [ "anonymous" ]
} ]</code></pre>
    <h3 class="field-label">Produces</h3>
    This API call produces the following media types according to the <span class="header">Accept</span> request header;
    the media type will be conveyed by the <span class="header">Content-Type</span> response header.
    <ul>
      <li><code>application/json</code></li>
    </ul>
    <h3 class="field-label">Responses</h3>
    <h4 class="field-label">200</h4>
    Succesful connection
  <h4 class="field-label">404</h4>
    No connection to server
        <a href="#"></a>
  </div> <!-- method -->
  <hr/>
  <h1><a name="Events">Events</a></h1>
  <div class="method"><a name="eventsGet"></a>
    <div class="method-path">
    <a class="up" href="#__Methods">Up</a>
    <pre class="get"><code class="huge"><span class="http-method">get</span> /events</code></pre></div>
    <div class="method-summary">Get event data (<span class="nickname">eventsGet</span>)</div>
    <div class="method-notes">Returns all the events active at Ticketmaster at this time</div>
<h3 class="field-label">Query parameters</h3>
    <div class="field-items">
      <div class="param">country (optional)</div>
        <div class="param-desc"><span class="param-type">Query Parameter</span> &mdash; Filter by country code. Needs to match exact. Case sensitive. </div>      <div class="param">title (optional)</div>
        <div class="param-desc"><span class="param-type">Query Parameter</span> &mdash; Filter by title of show. Finds shows that includes the word. Case insensitive. </div>      <div class="param">artist (optional)</div>
        <div class="param-desc"><span class="param-type">Query Parameter</span> &mdash; Filter by artist name. Finds attractions that includes the name. Case insensitive. </div>    </div>  <!-- field-items -->
<h3 class="field-label">Return type</h3>
    <div class="return-type">
      <a href="#inline_response_200_1">inline_response_200_1</a>
</div><!--Todo: process Response Object and its headers, schema, examples --><h3 class="field-label">Example data</h3>
    <div class="example-data-content-type">Content-Type: application/json</div>
    <pre class="example"><code>""</code></pre><h3 class="field-label">Produces</h3>
    This API call produces the following media types according to the <span class="header">Accept</span> request header;
    the media type will be conveyed by the <span class="header">Content-Type</span> response header.
    <ul>
      <li><code>application/json</code></li>
    </ul><h3 class="field-label">Responses</h3>
    <h4 class="field-label">200</h4>
    Result
        <a href="#inline_response_200_1">inline_response_200_1</a>
    <h4 class="field-label">404</h4>
    Error
        <a href="#noPage">noPage</a>
    <h4 class="field-label">503</h4>
    Error
        <a href="#noConnection">noConnection</a>
  </div> <!-- method -->
  <hr/>
  <div class="method"><a name="eventsSummer21Get"></a>
    <div class="method-path">
    <a class="up" href="#__Methods">Up</a>
    <pre class="get"><code class="huge"><span class="http-method">get</span> /events/summer21</code></pre></div>
    <div class="method-summary">Get event data for the summer months (<span class="nickname">eventsSummer21Get</span>)</div>
    <div class="method-notes">Returns all the events active at Ticketmaster between 2021-05-01 and 2021-09-01</div>
   <h3 class="field-label">Return type</h3>
    <div class="return-type">
      <a href="#inline_response_200_1">inline_response_200_1</a>
</div><!--Todo: process Response Object and its headers, schema, examples --><h3 class="field-label">Example data</h3>
    <div class="example-data-content-type">Content-Type: application/json</div>
    <pre class="example"><code>""</code></pre><h3 class="field-label">Produces</h3>
    This API call produces the following media types according to the <span class="header">Accept</span> request header;
    the media type will be conveyed by the <span class="header">Content-Type</span> response header.
    <ul>
      <li><code>application/json</code></li>
    </ul><h3 class="field-label">Responses</h3>
    <h4 class="field-label">200</h4>
    Result
        <a href="#inline_response_200_1">inline_response_200_1</a>
    <h4 class="field-label">404</h4>
    Error
        <a href="#noPage">noPage</a>
    <h4 class="field-label">503</h4>
    Error
        
  </div> <!-- method -->
  <hr/>
  <h1><a name="SingleEvent">SingleEvent</a></h1>
  <div class="method"><a name="eventsIdIdGet"></a>
    <div class="method-path">
    <a class="up" href="#__Methods">Up</a>
    <pre class="get"><code class="huge"><span class="http-method">get</span> /events/id/{id}</code></pre></div>
    <div class="method-summary">Get one event (<span class="nickname">eventsIdIdGet</span>)</div>
    <div class="method-notes">Return a single event with the specific id</div><h3 class="field-label">Path parameters</h3>
    <div class="field-items">
      <div class="param">id (required)</div>
        <div class="param-desc"><span class="param-type">Path Parameter</span> &mdash; Id of event </div>    </div>  <!-- field-items -->   <h3 class="field-label">Return type</h3>
    <div class="return-type">
      <a href="#events">events</a>
</div><!--Todo: process Response Object and its headers, schema, examples --><h3 class="field-label">Example data</h3>
    <div class="example-data-content-type">Content-Type: application/json</div>
    <pre class="example"><code>[ {
  "images" : [ {
    "url" : "https://s1.ticketm.net/imagepath.jpg",
    "width" : 640,
    "height" : 320
  }, {
    "url" : "https://s1.ticketm.net/imagepath.jpg",
    "width" : 640,
    "height" : 320
  } ],
  "_embedded" : [ {
    "venues" : [ {
      "name" : "Rotterdam Ahoy",
      "type" : "venue",
      "id" : "Z598xZbpZdk7k",
      "url" : "https://www.ticketmaster.nl/venue/rotterdam-ahoy-rotterdam-tickets/ahoy/112"
    }, {
      "name" : "Rotterdam Ahoy",
      "type" : "venue",
      "id" : "Z598xZbpZdk7k",
      "url" : "https://www.ticketmaster.nl/venue/rotterdam-ahoy-rotterdam-tickets/ahoy/112"
    } ],
    "attractions" : [ {
      "_id" : "609c62ddb14fe7283c71e315",
      "name" : "John Legend"
    }, {
      "_id" : "609c62ddb14fe7283c71e315",
      "name" : "John Legend"
    } ]
  }, {
    "venues" : [ {
      "name" : "Rotterdam Ahoy",
      "type" : "venue",
      "id" : "Z598xZbpZdk7k",
      "url" : "https://www.ticketmaster.nl/venue/rotterdam-ahoy-rotterdam-tickets/ahoy/112"
    }, {
      "name" : "Rotterdam Ahoy",
      "type" : "venue",
      "id" : "Z598xZbpZdk7k",
      "url" : "https://www.ticketmaster.nl/venue/rotterdam-ahoy-rotterdam-tickets/ahoy/112"
    } ],
    "attractions" : [ {
      "_id" : "609c62ddb14fe7283c71e315",
      "name" : "John Legend"
    }, {
      "_id" : "609c62ddb14fe7283c71e315",
      "name" : "John Legend"
    } ]
  } ],
  "name" : "Alicia Keys - Gold Lounge",
  "dates" : [ {
    "start" : [ {
      "dateTime" : "2021-07-08T18:00:00"
    }, {
      "dateTime" : "2021-07-08T18:00:00"
    } ]
  }, {
    "start" : [ {
      "dateTime" : "2021-07-08T18:00:00"
    }, {
      "dateTime" : "2021-07-08T18:00:00"
    } ]
  } ],
  "_id" : "609c62ddb14fe7283c71e314",
  "type" : "event"
}, {
  "images" : [ {
    "url" : "https://s1.ticketm.net/imagepath.jpg",
    "width" : 640,
    "height" : 320
  }, {
    "url" : "https://s1.ticketm.net/imagepath.jpg",
    "width" : 640,
    "height" : 320
  } ],
  "_embedded" : [ {
    "venues" : [ {
      "name" : "Rotterdam Ahoy",
      "type" : "venue",
      "id" : "Z598xZbpZdk7k",
      "url" : "https://www.ticketmaster.nl/venue/rotterdam-ahoy-rotterdam-tickets/ahoy/112"
    }, {
      "name" : "Rotterdam Ahoy",
      "type" : "venue",
      "id" : "Z598xZbpZdk7k",
      "url" : "https://www.ticketmaster.nl/venue/rotterdam-ahoy-rotterdam-tickets/ahoy/112"
    } ],
    "attractions" : [ {
      "_id" : "609c62ddb14fe7283c71e315",
      "name" : "John Legend"
    }, {
      "_id" : "609c62ddb14fe7283c71e315",
      "name" : "John Legend"
    } ]
  }, {
    "venues" : [ {
      "name" : "Rotterdam Ahoy",
      "type" : "venue",
      "id" : "Z598xZbpZdk7k",
      "url" : "https://www.ticketmaster.nl/venue/rotterdam-ahoy-rotterdam-tickets/ahoy/112"
    }, {
      "name" : "Rotterdam Ahoy",
      "type" : "venue",
      "id" : "Z598xZbpZdk7k",
      "url" : "https://www.ticketmaster.nl/venue/rotterdam-ahoy-rotterdam-tickets/ahoy/112"
    } ],
    "attractions" : [ {
      "_id" : "609c62ddb14fe7283c71e315",
      "name" : "John Legend"
    }, {
      "_id" : "609c62ddb14fe7283c71e315",
      "name" : "John Legend"
    } ]
  } ],
  "name" : "Alicia Keys - Gold Lounge",
  "dates" : [ {
    "start" : [ {
      "dateTime" : "2021-07-08T18:00:00"
    }, {
      "dateTime" : "2021-07-08T18:00:00"
    } ]
  }, {
    "start" : [ {
      "dateTime" : "2021-07-08T18:00:00"
    }, {
      "dateTime" : "2021-07-08T18:00:00"
    } ]
  } ],
  "_id" : "609c62ddb14fe7283c71e314",
  "type" : "event"
} ]</code></pre><h3 class="field-label">Produces</h3>
    This API call produces the following media types according to the <span class="header">Accept</span> request header;
    the media type will be conveyed by the <span class="header">Content-Type</span> response header.
    <ul>
      <li><code>application/json</code></li>
    </ul><h3 class="field-label">Responses</h3>
    <h4 class="field-label">200</h4>
    Result
        <a href="#events">events</a>
    <h4 class="field-label">404</h4>
    Error
        <a href="#inline_response_404">inline_response_404</a>
    <h4 class="field-label">503</h4>
    Error
        <a href="#noConnection">noConnection</a>
  </div> <!-- method -->
  <hr/>

  <h2><a name="__Models">Models</a></h2>
  [ Jump to <a href="#__Methods">Methods</a> ]

  <h3>Table of Contents</h3>
  <ol>
    <li><a href="#events"><code>events</code></a></li>
    <li><a href="#events_inner"><code>events_inner</code></a></li>
    <li><a href="#inline_response_200"><code>inline_response_200</code></a></li>
    <li><a href="#inline_response_200_1"><code>inline_response_200_1</code></a></li>
    <li><a href="#inline_response_404"><code>inline_response_404</code></a></li>
    <li><a href="#invalidId"><code>invalidId</code></a></li>
    <li><a href="#noConnection"><code>noConnection</code></a></li>
    <li><a href="#noHits"><code>noHits</code></a></li>
    <li><a href="#noPage"><code>noPage</code></a></li>
  </ol>

  <div class="model">
    <h3><a name="events"><code>events</code></a> <a class="up" href="#__Models">Up</a></h3>
    <div class="field-items">
          </div>  <!-- field-items -->
  </div>
  <div class="model">
    <h3><a name="events_inner"><code>events_inner</code></a> <a class="up" href="#__Models">Up</a></h3>
    
    <div class="field-items">
      <div class="param">_id (optional)</div><div class="param-desc"><span class="param-type"><a href="#object">Object</a></span>  </div>
          <div class="param-desc"><span class="param-type">example: 609c62ddb14fe7283c71e314</span></div>
<div class="param">name (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">String</a></span>  </div>
          <div class="param-desc"><span class="param-type">example: Alicia Keys - Gold Lounge</span></div>
<div class="param">type (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">String</a></span>  </div>
          <div class="param-desc"><span class="param-type">example: event</span></div>
<div class="param">images (optional)</div><div class="param-desc"><span class="param-type"><a href="#object">array[Object]</a></span>  </div>
<div class="param">dates (optional)</div><div class="param-desc"><span class="param-type"><a href="#object">array[Object]</a></span>  </div>
<div class="param">_embedded (optional)</div><div class="param-desc"><span class="param-type"><a href="#object">array[Object]</a></span>  </div>
    </div>  <!-- field-items -->
  </div>
  <div class="model">
    <h3><a name="inline_response_200"><code>inline_response_200</code></a> <a class="up" href="#__Models">Up</a></h3>
    <div class="field-items">
      <div class="param">path (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">String</a></span>  </div>
<div class="param">methods (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">array[String]</a></span>  </div>
<div class="param">middleware (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">array[String]</a></span>  </div>
    </div>  <!-- field-items -->
  </div>
  <div class="model">
    <h3><a name="inline_response_200_1"><code>inline_response_200_1</code></a> <a class="up" href="#__Models">Up</a></h3>
    <div class="field-items">
          </div>  <!-- field-items -->
  </div>
  <div class="model">
    <h3><a name="inline_response_404"><code>inline_response_404</code></a> <a class="up" href="#__Models">Up</a></h3>
    <div class="field-items">
          </div>  <!-- field-items -->
  </div>
  <div class="model">
    <h3><a name="invalidId"><code>invalidId</code></a> <a class="up" href="#__Models">Up</a></h3>
    <div class="field-items">
      <div class="param">result (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">String</a></span>  </div>
          <div class="param-desc"><span class="param-type">example: Invalid id</span></div>
    </div>  <!-- field-items -->
  </div>
  <div class="model">
    <h3><a name="noConnection"><code>noConnection</code></a> <a class="up" href="#__Models">Up</a></h3>
    <div class="field-items">
      <div class="param">error (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">String</a></span>  </div>
          <div class="param-desc"><span class="param-type">example: No connection to server</span></div>
    </div>  <!-- field-items -->
  </div>
  <div class="model">
    <h3><a name="noHits"><code>noHits</code></a> <a class="up" href="#__Models">Up</a></h3>
    <div class="field-items">
      <div class="param">error (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">String</a></span>  </div>
          <div class="param-desc"><span class="param-type">example: No events found</span></div>
    </div>  <!-- field-items -->
  </div>
  <div class="model">
    <h3><a name="noPage"><code>noPage</code></a> <a class="up" href="#__Models">Up</a></h3>
    <div class="field-items">
      <div class="param">error (optional)</div><div class="param-desc"><span class="param-type"><a href="#string">String</a></span>  </div>
          <div class="param-desc"><span class="param-type">example: Page not found</span></div>
    </div>  <!-- field-items -->
  </div>
  </body>
</html>
