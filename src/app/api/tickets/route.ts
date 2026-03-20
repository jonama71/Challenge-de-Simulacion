import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    /**
     * FIX: Evitar fuga de datos entre empresas (multi-tenant).
     *
     * Problema:
     * Antes se obtenían todos los tickets sin filtrar por empresa,
     * lo que permitía que un usuario visualice tickets de otras compañías.
     *
     * Solución:
     * Se filtra por companyId del usuario actual.
     *
     * Nota:
     * En un entorno real, este dato debe provenir de la sesión o token (JWT).
     * Aquí se simula el usuario autenticado para efectos de la prueba.
     */
    const currentUser = {
      companyId: 'TechCorp',
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        companyId: currentUser.companyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)

    return NextResponse.json(
      { error: 'Error fetching tickets' },
      { status: 500 }
    )
  }
}