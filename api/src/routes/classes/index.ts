import { Router, Request, Response } from 'express'
// * All routes under /classes/*
const router = Router()

// * Seed Classes Data
const Classes = {
  CS: [
    {
      number: '141',
      crn: '12345',
    },
    {
      number: '151',
      crn: '12343',
    },
    {
      number: '261',
      crn: '12341',
    },
  ],
  BIO: [
    {
      number: '100',
      crn: '32345',
    },
    {
      number: '101',
      crn: '32343',
    },
    {
      number: '202',
      crn: '32347',
    },
  ],
  MATH: [
    {
      number: '180',
      crn: '72345',
    },
    {
      number: '181',
      crn: '72342',
    },
  ],
}
router.get('/list/:subject', async (req: Request, res: Response) => {
  // TODO: Write route that grabs class list for given subject from Bharat's API
  const { subject } = req.params
  // * FOR NOW, CHECK AGAINST HASH MAP

  // * Send Class Response
  if (!subject || !Classes[subject]) {
    res.send([])
  } else {
    res.send(Classes[subject])
  }
})

const Terms = {
  '11111': ['CS', 'BIO', 'MATH'],
  '11112': ['CS', 'BIO'],
}
router.get('/subjects/:term', async (req: Request, res: Response) => {
  // TODO: Write route that grabs class subjects list for term from Bharat's API and returns them
  const { term } = req.params

  if (!term || !Terms[term]) {
    res.send([])
  } else {
    res.send(Terms[term])
  }
})

router.get('/terms', async (req: Request, res: Response) => {
  // TODO: Write route that grabs terms from Bharat's API, use seeded list for now
  res.send(['11111', '11112'])
})

export default router
