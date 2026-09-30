// api/subastas.js
export default async function handler(req, res) {
    // 1. Tomamos las claves secretas desde las Variables de Entorno de Vercel (no desde el código)
    const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
    const BASE_ID = process.env.BASE_ID;
    const TABLE_ID = 'tblUy6KSIZ5a1nWgj'; // Este ID de tabla puede ser público, no hay problema.

    // Validación por si olvidaste configurar las variables
    if (!AIRTABLE_PAT || !BASE_ID) {
        return res.status(500).json({ error: 'Faltan variables de entorno en Vercel.' });
    }

    try {
        // 2. Hacemos la consulta a Airtable desde el servidor (oculto al usuario)
        const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula={Estado}='Disponible'`, {
            headers: {
                Authorization: `Bearer ${AIRTABLE_PAT}`
            }
        });

        if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.error.message || 'Error al conectar con Airtable');
        }

        const data = await response.json();

        // 3. Enviamos los datos procesados de vuelta a tu página web
        res.status(200).json(data);

    } catch (error) {
        console.error("Error en el backend:", error);
        res.status(500).json({ error: 'Error interno del servidor al consultar el inventario.' });
    }
}
