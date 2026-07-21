import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/LegalPage";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "../lib/site";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad · Quimora Tech" },
      {
        name: "description",
        content:
          "Política de tratamiento de datos personales de Quimora Tech conforme a la Ley 1581 de 2012 de Colombia.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:url", content: "https://quimoratech.com/privacidad" },
    ],
    links: [{ rel: "canonical", href: "https://quimoratech.com/privacidad" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Política de Privacidad" updated="17 de julio de 2026">
      <p>
        En <strong>Quimora Tech</strong> valoramos y protegemos la privacidad de las personas que
        nos contactan. Esta Política describe cómo recolectamos, usamos y protegemos los datos
        personales, en cumplimiento de la <strong>Ley 1581 de 2012</strong> y el{" "}
        <strong>Decreto 1377 de 2013</strong> de la República de Colombia sobre protección de datos
        personales (Habeas Data).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de los datos es <strong>Quimora Tech</strong>, con sede en
        Cali, Valle del Cauca, Colombia.
      </p>
      <ul>
        <li>
          Correo: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </li>
        <li>Teléfono / WhatsApp: {CONTACT_PHONE_DISPLAY}</li>
      </ul>

      <h2>2. Datos que recolectamos</h2>
      <p>
        Recolectamos únicamente los datos que nos proporcionas de forma voluntaria a través de
        nuestro formulario de contacto, WhatsApp o correo electrónico:
      </p>
      <ul>
        <li>Nombre completo.</li>
        <li>Correo electrónico.</li>
        <li>Número de teléfono (opcional).</li>
        <li>El mensaje o la información sobre tu proyecto que decidas compartir.</li>
      </ul>
      <p>No recolectamos datos sensibles ni información de menores de edad de forma intencional.</p>

      <h2>3. Finalidad del tratamiento</h2>
      <p>Usamos tus datos exclusivamente para:</p>
      <ul>
        <li>Responder a tu consulta y ponernos en contacto contigo.</li>
        <li>Elaborar una propuesta o cotización de nuestros servicios.</li>
        <li>Dar seguimiento comercial a la solicitud que iniciaste.</li>
      </ul>
      <p>No vendemos, alquilamos ni compartimos tus datos con terceros para fines publicitarios.</p>

      <h2>4. Encargados y transferencia de datos</h2>
      <p>
        Para operar el sitio y recibir los mensajes del formulario utilizamos proveedores
        tecnológicos (por ejemplo, el servicio de recepción de formularios y la plataforma de
        alojamiento web). Estos proveedores actúan como encargados del tratamiento y solo procesan
        los datos para prestarnos el servicio. Algunos pueden almacenar información en servidores
        ubicados fuera de Colombia, siempre bajo estándares adecuados de seguridad.
      </p>

      <h2>5. Derechos del titular</h2>
      <p>
        Como titular de tus datos personales, y conforme a la Ley 1581 de 2012, tienes derecho a:
      </p>
      <ul>
        <li>Conocer, actualizar y rectificar tus datos personales.</li>
        <li>Solicitar prueba de la autorización otorgada.</li>
        <li>Ser informado sobre el uso que se les ha dado.</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
        <li>Revocar la autorización y/o solicitar la supresión de tus datos.</li>
        <li>Acceder de forma gratuita a tus datos personales tratados.</li>
      </ul>

      <h2>6. Cómo ejercer tus derechos</h2>
      <p>
        Puedes ejercer cualquiera de estos derechos escribiéndonos a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Atenderemos tu solicitud en los
        plazos que establece la ley (consultas en un máximo de 10 días hábiles y reclamos en un
        máximo de 15 días hábiles).
      </p>

      <h2>7. Conservación de los datos</h2>
      <p>
        Conservamos tus datos durante el tiempo necesario para atender tu solicitud y gestionar la
        relación comercial. Cuando ya no sean necesarios, o si solicitas su supresión, serán
        eliminados de nuestros registros.
      </p>

      <h2>8. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger tus datos frente a
        acceso no autorizado, pérdida o alteración. El sitio se sirve mediante conexión cifrada
        (HTTPS).
      </p>

      <h2>9. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta Política de Privacidad en cualquier momento. La versión vigente será
        siempre la publicada en esta página, con su fecha de última actualización.
      </p>

      <h2>10. Contacto</h2>
      <p>
        Si tienes dudas sobre esta política o sobre el tratamiento de tus datos, escríbenos a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
