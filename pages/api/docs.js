/**
 * API Documentation
 * OpenAPI/Swagger specification
 */

export default function handler(req, res) {
  const apiDocs = {
    openapi: '3.0.0',
    info: {
      title: 'RoomGenius AI API',
      version: '2.0.0',
      description: 'AI-powered interior design generation API',
      contact: {
        name: 'RoomGenius AI Support',
        email: 'support@roomgenius.ai',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        description: 'Production server',
      },
    ],
    paths: {
      '/api/generate': {
        post: {
          summary: 'Generate interior design',
          description: 'Generate AI-powered interior design from room image',
          tags: ['Generation'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['imageUrl', 'style'],
                  properties: {
                    imageUrl: {
                      type: 'string',
                      format: 'uri',
                      description: 'URL of uploaded room image',
                    },
                    style: {
                      type: 'string',
                      enum: ['modern', 'minimalist', 'scandi', 'industrial', 'bohemian'],
                      description: 'Interior design style',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Design generated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      output: { type: 'string', format: 'uri' },
                      style: { type: 'string' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
            400: { description: 'Invalid input' },
            401: { description: 'Unauthorized' },
            402: { description: 'Insufficient credits' },
            500: { description: 'Server error' },
          },
        },
      },
      '/api/payment': {
        post: {
          summary: 'Create payment',
          description: 'Create payment with Yookassa',
          tags: ['Payment'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['amount', 'description'],
                  properties: {
                    amount: { type: 'number', minimum: 1 },
                    description: { type: 'string' },
                    metadata: { type: 'object' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Payment created',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      paymentId: { type: 'string' },
                      confirmationUrl: { type: 'string', format: 'uri' },
                      status: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/generations': {
        get: {
          summary: 'Get user generations',
          description: 'Retrieve user\'s generation history',
          tags: ['Generations'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'page',
              schema: { type: 'integer', minimum: 1, default: 1 },
            },
            {
              in: 'query',
              name: 'limit',
              schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
            },
            {
              in: 'query',
              name: 'status',
              schema: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] },
            },
          ],
          responses: {
            200: {
              description: 'Generations retrieved',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Generation' },
                      },
                      pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/collections': {
        get: {
          summary: 'Get user collections',
          tags: ['Collections'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Collections retrieved',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Collection' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create collection',
          tags: ['Collections'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    isPublic: { type: 'boolean', default: false },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Collection created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Collection' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Generation: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            original_image_url: { type: 'string', format: 'uri' },
            generated_image_url: { type: 'string', format: 'uri' },
            style: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] },
            created_at: { type: 'string', format: 'date-time' },
            completed_at: { type: 'string', format: 'date-time' },
          },
        },
        Collection: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            is_public: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
            statusCode: { type: 'integer' },
          },
        },
      },
    },
  };

  res.status(200).json(apiDocs);
}
