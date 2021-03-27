# Product Management API
Objective of building this API is to mange products. API build using SQLite embeded database, which contains a table called products.

### Tools and Technologies involved 
<ul>
  <li>IDE - Visual Studio Code</li>
  <li>Programming Language - JavaScript (NodeJS)</li>
  <li>Web framework - Express</li>
  <li>Database - SQLite Embeded</li>
</ul>

### Products Table
Product table contains following columns:
<ul>
  <li>id - auto incremented and primary key</li>
  <li>name - varchar and unique</li>
  <li>description - text and is optional</li>
  <li>price - numeric and not null</li>
  <li>deleted - boolean with default value 0</li>
  <li>viewed - integer for incrementing the value when the product is viewed</li>
  <li>createdat- text to store timestamp</li>
</ul>

### API Methods
<table>
  <thead>
    <tr>
      <th>API</th>
      <th>METHOD</th>
      <th>Comments</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        /product/add
      </td>
      <td>
        POST
      </td>
      <td>
        Add new product
      </td>
    </tr>
    <tr>
      <td>
        /product/:id/:currency?
      </td>
      <td>
        GET
      </td>
      <td>
        Gets single product
      </td>
    </tr>
    <tr>
      <td>
        /product/list
      </td>
      <td>
        POST
      </td>
      <td>
        List all products with parameters like name, description and price and currency
      </td>
    </tr>
    <tr>
      <td>
        /product/polular
      </td>
      <td>
        POST
      </td>
      <td>
        List of the most viewed products using parameters like top and currency
      </td>
    </tr>
    <tr>
      <td>
        /product/:id
      </td>
      <td>
        DELETE
      </td>
      <td>
        Mark product as deleted
      </td>
    </tr>
  </tbody>
</table>