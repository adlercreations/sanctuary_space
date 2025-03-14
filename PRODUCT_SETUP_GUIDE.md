# Setting Up Products for the Shop Page

This guide explains how to add products to your database using Postman, which will then be displayed on the Shop page.

## Prerequisites

1. Make sure your backend server is running
2. Have Postman installed (or use the web version at https://www.postman.com/)

## Adding Products via Postman

1. Open Postman
2. Create a new request:
   - Set the request type to **POST**
   - Set the URL to `http://127.0.0.1:5000/api/products`
   - Go to the "Headers" tab and add:
     - Key: `Content-Type`
     - Value: `application/json`
   - If your API requires authentication, add the Authorization header with your JWT token:
     - Key: `Authorization`
     - Value: `Bearer your_access_token_here`

3. In the "Body" tab:
   - Select "raw"
   - Select "JSON" from the dropdown
   - Add your product data in JSON format, for example:

```json
{
  "name": "Calming Chamomile Tea",
  "price": 12.99,
  "description": "A soothing blend of chamomile flowers that helps reduce stress and promotes better sleep.",
  "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
}
```

4. Click "Send" to create the product
5. You should receive a response with status 201 and a success message

## Sample Products

Here are some sample products you can add:

```json
{
  "name": "Lavender Relaxation Tea",
  "price": 14.99,
  "description": "A calming blend with lavender and other herbs to help you unwind after a long day.",
  "image_url": "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
}
```

```json
{
  "name": "Meditation Cushion",
  "price": 39.99,
  "description": "A comfortable cushion designed to support proper posture during meditation sessions.",
  "image_url": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
}
```

```json
{
  "name": "Essential Oil Diffuser",
  "price": 29.99,
  "description": "A stylish diffuser that disperses essential oils to create a calming atmosphere in your space.",
  "image_url": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
}
```

## Viewing Products on the Shop Page

After adding products:

1. Make sure your frontend is running
2. Navigate to the Shop page in your browser
3. The products you added should be displayed with their names, prices, and images

## Troubleshooting

If products aren't showing up:

1. Check your browser console for any errors
2. Verify that the backend server is running
3. Check that the API endpoint is correct in your frontend code
4. Make sure the database connection is working properly 