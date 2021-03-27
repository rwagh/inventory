# Product Management API
Objective of building this API is to mange products. API build using SQLite embeded database, which contains a table called products.

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
<ul>
  <li>Add - Add new product</li>
  <li>Get - Get single product</li>
  <li>List - List all products with parameters like name, description and price and currency</li>
  <li>Polular - List of the most viewed products using parameters like top and currency</li>
  <li>Delete - Mark product as deleted</li>
</ul>