import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido. Solo se acepta POST.' 
    });
  }

  // Validar que se envíen los datos requeridos
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos requeridos: name, email, message'
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido'
    });
  }

  try {
    // Configurar el transportador de nodemailer
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // Puedes cambiar esto por tu proveedor
      auth: {
        user: process.env.EMAIL_USER, // Tu email
        pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación
      }
    });

    // Configurar el email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER, // Email de destino
      subject: `Nuevo contacto de ${name} - Datafield`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Nuevo mensaje de contacto - Datafield
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Información del contacto:</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #eff6ff; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #1e40af;">
              <strong>Nota:</strong> Este email fue enviado desde el formulario de contacto del sitio web de Datafield.
            </p>
          </div>
        </div>
      `,
      // También incluir versión de texto plano
      text: `
        Nuevo mensaje de contacto - Datafield
        
        Nombre: ${name}
        Email: ${email}
        
        Mensaje:
        ${message}
        
        ---
        Este email fue enviado desde el formulario de contacto del sitio web de Datafield.
      `
    };

    // Enviar el email
    await transporter.sendMail(mailOptions);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: 'Email enviado correctamente'
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    
    // Respuesta de error
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al enviar el email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}