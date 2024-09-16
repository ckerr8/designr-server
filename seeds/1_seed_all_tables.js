/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes ALL existing entries
    await knex('tasks').del()
    await knex('assets').del()
    await knex('projects').del()
    await knex('clients').del()
  
    // Insert clients
    await knex('clients').insert([
      {
        id: "6FF4A3AE-2135-46DB-9238-D1E90E8B0719",
        address: "123 Main St",
        city: "New York",
        industry: "Technology",
        contact_name: "Nester Brookfield",
        contact_position: "CEO",
        contact_phone: "555-1234",
        contact_email: "nester@brookfield.com"
      },
      {
        id: "1E405F81-A7C8-4148-8704-5B29F97285E9",
        address: "456 Elm St",
        city: "San Francisco",
        industry: "Design",
        contact_name: "Esme Ayscough",
        contact_position: "Creative Director",
        contact_phone: "555-5678",
        contact_email: "esme@ayscough.com"
      }
    ]);
  
    // Insert projects
    await knex('projects').insert([
      {
        id: "77946ca1-73a1-4af1-a38f-af2bef758e74",
        project_name: "Brookfield Campaign",
        clients_id: "6FF4A3AE-2135-46DB-9238-D1E90E8B0719",
        description: "Comprehensive marketing campaign for Brookfield Inc.'s spring product line",
        image: "image_1.jpg",
        deadline: '2024-03-31',
        price: 15000.00
      },
      {
        id: "1aed3a28-d849-4073-8845-e8731b4170ab",
        project_name: "Ayscough Redesign",
        clients_id: "1E405F81-A7C8-4148-8704-5B29F97285E9",
        description: "Complete redesign of Ayscough Designs' corporate website",
        image: "image_2.jpg",
        deadline: '2024-06-30',
        price: 25000.00
      }
    ]);
  
    // Insert assets
    await knex('assets').insert([
      {
        id: "C0BD0EBD-527A-415B-B9C4-B19829BA2966",
        clients_id: "6FF4A3AE-2135-46DB-9238-D1E90E8B0719",
        asset_name: "Nester Brookfield Profile Photo",
        category: "Image",
        status: "Active",
        quantity: 1
      },
      {
        id: "7793435B-9329-46E6-965A-AF48CFD7C08C",
        clients_id: "1E405F81-A7C8-4148-8704-5B29F97285E9",
        asset_name: "Esme Ayscough Project Files",
        category: "Document",
        status: "In Use",
        quantity: 3
      }
    ]);
  
    // Insert tasks
    await knex('tasks').insert([
      {
        id: "D7C38697-E81E-4D06-9AD5-AF4C82D34038",
        projects_id: "77946ca1-73a1-4af1-a38f-af2bef758e74",
        category: "Branding",
        status: "Completed",
        quantity: 1
      },
      {
        id: "8CE85981-87BF-4318-A43D-E4C68A36C91B",
        projects_id: "1aed3a28-d849-4073-8845-e8731b4170ab",
        category: "Product Launch",
        status: "Active",
        quantity: 1
      }
    ]);
  }