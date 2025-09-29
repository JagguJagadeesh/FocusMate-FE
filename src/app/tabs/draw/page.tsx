import React from 'react'
import NotesClient from './NotesClient'
import { withAuth } from '@/utils/AuthWarpper'

function Draw() {
  return (
    <div>
        <NotesClient />
    </div>
  )
}

export default withAuth(Draw)