import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/LegalPage";
import { CONTACT_EMAIL } from "../lib/site";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y Condiciones · Quimora Tech" },
      {
        name: "description",
        content:
          "Términos y condiciones de uso del sitio web y de los servicios de diseño y desarrollo web de Quimora Tech.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Términos y Condiciones" updated="17 de julio de 2026">
      <p>
        Estos Términos y Condiciones regulan el uso del sitio web de <strong>Quimora Tech</strong> y
        el marco general de los servicios de diseño y desarrollo web que ofrecemos. Al navegar por
        este sitio o contactarnos, aceptas los presentes términos.
      </p>

      <h2>1. Objeto</h2>
      <p>
        Quimora Tech es un estudio de diseño y desarrollo web con sede en Cali, Colombia. A través
        de este sitio presentamos nuestros servicios y facilitamos el contacto con clientes
        potenciales. Este sitio tiene carácter informativo y no constituye, por sí mismo, una oferta
        comercial vinculante.
      </p>

      <h2>2. Servicios y cotizaciones</h2>
      <p>
        Los servicios, alcances, tiempos y precios mostrados en el sitio son de carácter orientativo
        y pueden variar según las necesidades de cada proyecto. El alcance definitivo, el valor y
        las condiciones de cada trabajo se acordarán por escrito mediante una propuesta o cotización
        específica antes de iniciar cualquier desarrollo.
      </p>

      <h2>3. Precios</h2>
      <p>
        Los valores de referencia publicados están expresados en pesos colombianos (COP) y no
        incluyen, salvo indicación expresa, costos de terceros como dominios, alojamiento,
        licencias, pasarelas de pago o servicios externos. El precio final se confirmará en la
        cotización correspondiente.
      </p>

      <h2>4. Propiedad intelectual</h2>
      <p>
        Los contenidos de este sitio (textos, diseño, gráficos y código) pertenecen a Quimora Tech,
        salvo indicación contraria. La titularidad de los entregables desarrollados para un cliente
        se transferirá conforme a lo pactado en el contrato o propuesta de cada proyecto, por lo
        general una vez completado el pago acordado.
      </p>

      <h2>5. Obligaciones del usuario</h2>
      <p>Al usar este sitio y contactarnos, te comprometes a:</p>
      <ul>
        <li>Proporcionar información veraz en el formulario de contacto.</li>
        <li>No usar el sitio con fines ilícitos o que puedan dañar a Quimora Tech o a terceros.</li>
        <li>Respetar los derechos de propiedad intelectual antes mencionados.</li>
      </ul>

      <h2>6. Limitación de responsabilidad</h2>
      <p>
        Procuramos que la información del sitio esté actualizada y sea correcta, pero no
        garantizamos que esté libre de errores u omisiones. Quimora Tech no será responsable por
        daños derivados del uso del sitio o de la imposibilidad de acceder a él. Los enlaces a
        sitios de terceros se ofrecen por conveniencia y no implican respaldo sobre su contenido.
      </p>

      <h2>7. Protección de datos</h2>
      <p>
        El tratamiento de los datos personales que nos facilitas se rige por nuestra{" "}
        <a href="/privacidad">Política de Privacidad</a>, elaborada conforme a la Ley 1581 de 2012
        de Colombia.
      </p>

      <h2>8. Modificaciones</h2>
      <p>
        Podemos actualizar estos Términos en cualquier momento. La versión vigente será siempre la
        publicada en esta página, con su fecha de última actualización.
      </p>

      <h2>9. Ley aplicable</h2>
      <p>
        Estos Términos se rigen por las leyes de la República de Colombia. Cualquier controversia se
        someterá a la jurisdicción de los tribunales competentes de la ciudad de Cali.
      </p>

      <h2>10. Contacto</h2>
      <p>
        Para cualquier consulta sobre estos Términos, escríbenos a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
