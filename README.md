# 🛠️ TechCorp Support Challenge

Prueba técnica resuelta para el rol de soporte / desarrollo en TechCorp.

---

## 👨‍💻 Autor

**Jonathan Arellano**

---

## 📌 Descripción

Se recibió un sistema con múltiples fallos críticos reportados por el cliente, incluyendo problemas de seguridad, errores en la interfaz y fallos en el manejo de estado.

El objetivo fue identificar, analizar y corregir estos problemas manteniendo buenas prácticas de desarrollo y priorizando los errores según su impacto.

---

## 🚨 Problemas identificados y soluciones

### 1. 🔒 Fuga de datos entre empresas (CRÍTICO)

**Problema:**
La API retornaba todos los tickets sin filtrar por empresa, permitiendo que un usuario visualice información de otras compañías.

**Solución:**
Se implementó filtrado por `companyId` basado en el usuario actual (simulado).

```ts
const currentUser = {
  companyId: 'TechCorp',
}

const tickets = await prisma.ticket.findMany({
  where: {
    companyId: currentUser.companyId,
  },
})
```

---

### 2. ⚛️ La UI no se actualizaba al resolver tickets

**Problema:**
Se estaba mutando directamente el estado de React, lo que impedía que la interfaz se re-renderizara correctamente.

**Solución:**
Se reemplazó la mutación por una actualización inmutable usando `map()`.

```ts
setTickets((prev) =>
  prev.map((t) =>
    t.id === updatedTicket.id ? updatedTicket : t
  )
)
```

---

### 3. 📱 Botón "Resolver Ticket" no funcionaba en móvil

**Problema:**
Un footer fijo (`position: fixed`) cubría el contenido inferior, bloqueando la interacción con el botón en dispositivos móviles.

**Solución:**
Se agregó padding inferior al contenedor principal.

```tsx
<div className="pb-24 md:pb-0">
```

---

### 4. ⏳ Tickets urgentes se quedaban cargando indefinidamente

**Problema:**
Una promesa (`sendEmailNotification`) nunca se resolvía, bloqueando el flujo al resolver tickets urgentes.

**Solución:**
Se corrigió la función para que la promesa se resuelva correctamente.

```ts
return new Promise((resolve) => {
  resolve()
})
```

---

### 5. 🔐 Mejora adicional: Seguridad en actualización de tickets

**Problema:**
Un usuario podía modificar tickets de otra empresa accediendo directamente por ID.

**Solución:**
Se validó que el ticket pertenezca a la empresa del usuario antes de actualizar.

```ts
const ticket = await prisma.ticket.findFirst({
  where: {
    id,
    companyId: currentUser.companyId,
  },
})
```

---

## ⚙️ Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/techcorp-support-challenge.git
cd techcorp-support-challenge
```

---

### 2. Instalar dependencias

```bash
npm install
```

---

### 3. Crear archivo `.env`

```env
DATABASE_URL="file:./dev.db"
```

---

### 4. Configurar base de datos

```bash
npm run db:setup
```

---

### 5. Ejecutar el proyecto

```bash
npm run dev
```

---

### 6. Abrir en navegador

```
http://localhost:3000
```

---

## 🧠 Decisiones técnicas

* Se priorizó la corrección del bug de seguridad (multi-tenant) por su impacto crítico.
* Se respetó la arquitectura existente del proyecto.
* Se aplicaron buenas prácticas en:

  * manejo de estado en React
  * validación en backend
  * control de promesas async
* Se dejó preparado el código para futura integración con autenticación real.

---

## 🚀 Tecnologías utilizadas

* Next.js (App Router)
* React
* Prisma ORM
* SQLite
* Tailwind CSS

---

## ✅ Estado final

✔ Sistema funcional
✔ Bugs críticos resueltos
✔ Seguridad mejorada
✔ UI responsive corregida

---

## 📩 Notas finales

Este ejercicio se abordó simulando un escenario real de soporte en producción, priorizando:

* Seguridad
* Estabilidad
* Experiencia de usuario

---
