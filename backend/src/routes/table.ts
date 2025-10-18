import { Router } from 'express';
import { apiKeyAuth } from '../middleware/auth.js';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const router = Router();

// POST /api/v1/tables
router.post('/', apiKeyAuth, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Table name is required' });
  }

  // Simple slug generation
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  try {
    const newTable = await prisma.table.create({
      data: {
        name,
        slug,
        ownerId: 'admin', // placeholder for now
        config: {},
      },
    });
    res.status(201).json(newTable);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'A table with this name already exists.' });
      }
    }
    console.error('Error creating table:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET /api/v1/tables/:tableId
router.get('/:tableId', apiKeyAuth, async (req, res) => {
  const { tableId } = req.params;

  if (!tableId) {
    return res.status(400).json({ error: 'Table ID is required' });
  }

  try {
    const table = await prisma.table.findUnique({
      where: {
        id: tableId,
      },
    });

    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.json(table);
  } catch (error) {
    console.error('Error getting table details:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET /api/v1/tables/:tableId/rows
router.get('/:tableId/rows', apiKeyAuth, async (req, res) => {
  const { tableId } = req.params;
  if (!tableId) {
    return res.status(400).json({ error: 'Table ID is required' });
  }
  try {
    const rows = await prisma.row.findMany({
      where: {
        tableId: tableId,
      },
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST /api/v1/tables/:tableId/rows
router.post('/:tableId/rows', apiKeyAuth, async (req, res) => {
  const { tableId } = req.params;
  if (!tableId) {
    return res.status(400).json({ error: 'Table ID is required' });
  }
  console.log('Received request to create a row:', req.body);
  try {
    const newRow = await prisma.row.create({
      data: {
        tableId: tableId,
        data: req.body.data,
        createdBy: 'admin', // placeholder
      },
    });
    console.log('Successfully created new row:', newRow);
    res.json(newRow);
  } catch (error) {
    console.error('Error creating row:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// PATCH /api/v1/tables/:tableId/rows/:rowId
router.patch('/:tableId/rows/:rowId', apiKeyAuth, async (req, res) => {
  const { tableId, rowId } = req.params;
  const { data } = req.body;

  if (!tableId || !rowId) {
    return res.status(400).json({ error: 'Table ID and Row ID are required' });
  }

  if (!data) {
    return res.status(400).json({ error: 'Data to update is required' });
  }

  try {
    const updatedRow = await prisma.row.update({
      where: {
        id: rowId,
        tableId: tableId,
      },
      data: {
        data: data,
      },
    });
    res.json(updatedRow);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Row not found' });
      }
    }
    console.error('Error updating row:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


// DELETE /api/v1/tables/:tableId
router.delete('/:tableId', apiKeyAuth, async (req, res) => {
  const { tableId } = req.params;

  if (!tableId) {
    return res.status(400).json({ error: 'Table ID is required' });
  }

  try {
    await prisma.table.delete({
      where: {
        id: tableId,
      },
    });
    res.status(204).send(); // No content to send back on successful deletion
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Table not found' });
      }
    }
    console.error('Error deleting table:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;