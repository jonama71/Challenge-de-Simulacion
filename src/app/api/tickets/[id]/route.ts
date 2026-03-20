import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simulación de envío de correo para tickets urgentes.
// En un caso real aquí iría la integración con un proveedor externo.
async function sendEmailNotification(ticketId: string, companyId: string) {
  /**
   * FIX: Evitar promesa colgada.
   *
   * Antes esta función devolvía una promesa que nunca llamaba a resolve(),
   * provocando que el flujo del PATCH quedara esperando indefinidamente
   * al intentar resolver tickets urgentes.
   *
   * Ahora se resuelve correctamente la promesa para permitir que el proceso
   * continúe y el ticket pueda actualizarse.
   */
  return new Promise<void>((resolve) => {
    console.log(
      `Enviando notificación urgente para el ticket ${ticketId} de la empresa ${companyId}...`
    )

    resolve()
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()

    /**
     * FIX: Simular usuario autenticado para mantener aislamiento multi-tenant.
     *
     * En producción este dato debe venir desde la sesión o token del usuario.
     */
    const currentUser = {
      companyId: 'TechCorp',
    }

    /**
     * FIX: Validar que el ticket pertenezca a la empresa del usuario actual.
     *
     * Esto evita que un usuario pueda modificar tickets de otra compañía
     * accediendo directamente por ID.
     */
    const ticket = await prisma.ticket.findFirst({
      where: {
        id,
        companyId: currentUser.companyId,
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket no encontrado o sin permisos para modificarlo' },
        { status: 404 }
      )
    }

    if (ticket.priority === 'Urgente' && status === 'Resuelto') {
      await sendEmailNotification(ticket.id, ticket.companyId)
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status },
    })

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error('Error updating ticket:', error)

    return NextResponse.json(
      { error: 'Error updating ticket' },
      { status: 500 }
    )
  }
}