import { Term as TTerm } from 'registrum-common/dist/lib/Banner'
import { TermSchema } from 'registrum-common/dist/schemas/Banner'
import { Document, model } from 'mongoose'

const Term = model<TTerm & Document>('Term', TermSchema)
export default Term
