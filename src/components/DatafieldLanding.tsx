"use client";

import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Fuel, Building2, Mountain, Shield, Map as MapIcon, Ruler, Thermometer, Trees, Layers, Send, ArrowRight, X } from 'lucide-react';
import ComparativeMotionCharts from "@/components/ComparativeMotionCharts";


/* ==================== Config WhatsApp ==================== */
const WHATSAPP_NUMBER = '5491173629944'; // Reemplazar por el número real con código de país (p.ej. 54911XXXXXXXX)
const DEFAULT_MESSAGE = 'Hola Datafield, quiero cotizar un servicio en ...';

/** Construye el enlace seguro a WhatsApp con el mensaje correctamente codificado. */
export function buildWhatsAppLink(phone: string, message: string) {
  const digits = (phone || '').replace(/\D/g, '');
  const encoded = encodeURIComponent(message || '');
  return `https://wa.me/${digits}?text=${encoded}`;
}

const WHATSAPP_LINK = buildWhatsAppLink(WHATSAPP_NUMBER, DEFAULT_MESSAGE);

export default function DatafieldLanding() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  
  // ✅ AGREGAR: Estados para el formulario
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
  
    // ✅ GUARDAR referencia del formulario antes del fetch
    const form = e.currentTarget;
    
    const formData = new FormData(form);
    const data = {
      name: formData.get('nombre') as string,
      email: formData.get('email') as string,
      message: formData.get('remark') as string,
      organization: formData.get('organizacion') as string,
      newsletter: formData.get('newsletter') === 'on'
    };
    
    try {
      const response = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL || '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        setSubmitStatus('success');
        setShowSuccessModal(true);
        // ✅ USAR la referencia guardada y verificar que existe
        if (form) {
          form.reset();
        }
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div ref={pageRef} className="min-h-screen bg-black text-white selection:bg-white/10">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-8 items-center sm:flex sm:justify-between">
          {/* Col 1: 25% (2/8) */}
          <div className="col-span-1 flex items-center gap-2 sm:col-span-auto">
            <div className="grid place-items-center">
              <img className="h-6 w-6" src="/Isotipo@2x.png" alt="Datafield" />
            </div>
            {/* Logo para ≥ sm (tamaño controlado) */}
            <img src="/1.svg" alt="Datafield logo" className="h-3 w-auto hidden sm:inline" />
            {/* <span className="font-semibold tracking-wide">DATAFIELD</span> */}
            <span className="ml-2 text-xs text-white/50 hidden sm:inline">Operaciones aéreas de precisión</span>
          </div>

          {/* Col 2: 50% (4/8) — logo centrado solo en móvil */}
          <div className="col-span-4 grid place-items-center sm:hidden">
            <img src="/1.svg" alt="Datafield logo" className="h-10 w-auto" />
          </div>

          {/* Col 3: 25% (2/8) */}
          <div className="col-span-3 flex items-center justify-end gap-3 sm:col-span-auto">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 sm:ml-0 rounded-md bg-white text-black hover:bg-white/90 px-4 py-2 text-sm font-medium"
            >
              Contacto por WhatsApp
            </a>
          </div>
        </div>
        {/* Barra de progreso de scroll */}
        <motion.div style={{ scaleX: progress }} className="origin-left h-[2px] w-full bg-white/40" />
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-stone-100">
        <BackgroundGrid />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-800"
          >
            Soluciones geoespaciales con drones.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-2xl text-zinc-600"
          >
            Planificamos, volamos, procesamos. <br /> Nuestras operaciones te facilitan la toma de decisiones oportuna, el ahorro de costos, la mejora de la seguridad del personal y una eficiencia óptima mediante la recopilación de datos aéreos.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex items-center gap-4"
          >
            <a href="#workflow" className="rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 text-sm font-medium inline-flex items-center">
              Ver flujo de trabajo <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Industrias */}
      {/* <SplitBand>
        <IndustryCard
          icon={<Building2 className="h-5 w-5" aria-hidden />}
          title="Construcción"
          bullets={[
            'Ortofotos y DTM para ingeniería',
            'Avance de obra y cubicaciones',
            'Entrega de planos y reportes ejecutivos',
          ]}
        />

        <IndustryCard
          icon={<Mountain className="h-5 w-5" aria-hidden />}
          title="Minería"
          bullets={[
            'Volúmenes de acopio y corte/relleno',
            'Modelos 3D y mallas texturizadas',
            'Planificación y control de avance',
          ]}
          
        />
        <IndustryCard
          icon={<Fuel className="h-5 w-5" aria-hidden />}
          title="Petróleo"
          bullets={[
            'Inspecciones de ductos y facilidades',
            'Levantamientos topográficos en áreas remotas',
            'Monitoreo térmico y detección de puntos críticos',
          ]}
        />
        
      </SplitBand> */}

      {/* <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-semibold tracking-tight text-white/60 mt-16 mb-8 flex justify-center"
          >
           Resultados digitales de alta precisión.
          </motion.h2>
      </div> */}

      {/* NUEVA sección */}
      <ApplicationsServices />

      {/* Comparativo de Motion */}
      <section className="mt-16 rounded-xs border-t border-white/10">
        <ComparativeMotionCharts />

        {/* Descripción detallada de impacto por industria */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.1 }}
              className="rounded-xs border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-green-400" aria-hidden />
                <h3 className="text-lg font-medium">Construcción</h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Los relevamientos aéreos permiten reducir hasta un <strong className="text-white">60 % el tiempo</strong> necesario para obtener datos de obra, acelerando decisiones y control de avance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              className="rounded-xs border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-center gap-3">
                <Mountain className="h-5 w-5 text-blue-400" aria-hidden />
                <h3 className="text-lg font-medium">Minería</h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Un levantamiento que con métodos tradicionales tarda <strong className="text-white">dos semanas</strong>, con dron se hace en apenas <strong className="text-white">3 días</strong>. La precisión en cubicaciones se mantiene dentro del margen aceptable (±3 %), con diferencias mínimas respecto al trabajo manual. Además, con LiDAR se han registrado eficiencias de hasta <strong className="text-white">6.5×</strong>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.2 }}
              className="rounded-xs border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-center gap-3">
                <Fuel className="h-5 w-5 text-orange-400" aria-hidden />
                <h3 className="text-lg font-medium">Oil & Gas</h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                El impacto es todavía más fuerte: inspecciones con drones pueden reducir <strong className="text-white">70 % de los costos</strong> y hasta <strong className="text-white">90 % el tiempo de downtime</strong> (equipos parados).
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flujo de Trabajo */}
      <section id="workflow" className="relative py-24 mt-16 rounded-xs border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Flujo de trabajo" subtitle="Transparente, seguro y medible."/>
          <Timeline />
        </div>
      </section>

      {/* Entregables */}
      <section className="relative py-24 border-y border-white/10 bg-gradient-to-b from-black via-black to-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Entregables y formatos" subtitle="Listos para ingeniería, gerencia y catastro." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Deliverable icon={<MapIcon className="h-4 w-4" aria-hidden />} title="Ortofotos georreferenciadas (GeoTIFF)" desc="Centimétricas con RTK/PPK." />
            <Deliverable icon={<Layers className="h-4 w-4" aria-hidden />} title="DSM / DTM" desc="Modelos de elevación para diseño y drenajes." />
            <Deliverable icon={<Ruler className="h-4 w-4" aria-hidden />} title="Curvas de nivel" desc="Intervalos configurables para obra." />
            <Deliverable icon={<Mountain className="h-4 w-4" aria-hidden />} title="Volumetrías" desc="Cubicaciones de pilas y movimiento de suelos." />
            <Deliverable icon={<Thermometer className="h-4 w-4" aria-hidden />} title="Térmico" desc="Inspecciones IR para oil & gas y energía." />
            <Deliverable icon={<Trees className="h-4 w-4" aria-hidden />} title="NDVI / NDRE" desc="Vegetación y servidumbres en ductos." />
          </div>
          <SectionHeader title='' subtitle='Y mas...' /> 
        </div>
      </section>

      {/* Equipamiento y Seguridad */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Equipamiento y seguridad" subtitle="Drones DJI + protocolos de riesgo nivel industrial." />
          <div className="grid lg:grid-cols-2 gap-6">
            <SpecCard
              title="Plataformas"
              items={[
                'Matrice 400/350 RTK — misiones diurnas/nocturnas',
                'Matrice 4 E',
                'Mavic 3 Multispectral',
              ]}
            />
            <SpecCard
              title="Protocolos"
              items={[
                'Análisis de riesgo (SORA / listas de verificación)',
                'Pilotos habilitados + seguros y permisos locales',
                'Geocercas, redundancia y registros de vuelo',
              ]}
            />
          </div>          
        </div>        
      </section>

      {/* CTA final */}
      <section className="relative py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xs border border-white/10 bg-white/[0.03] p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              {/* <h3 className="text-2xl font-semibold">¿Listo?</h3> */}
              <p className="text-white/60">Escríbenos el área, objetivo y plazo. Proponemos plan y presupuesto estimado en el momento.</p>
            </div>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white text-black hover:bg-white/90 px-4 py-2 text-sm font-medium"
            >
              Contacto por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Formulario de Contacto */}
      <section className="relative py-24 bg-gradient-to-b from-zinc-100 to-zinc-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Contacto</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              ¿Listo para transformar tu proyecto con datos precisos? Completa el formulario y nos pondremos en contacto contigo.
            </p>
          </div>

          <div className="bg-white rounded-xs shadow-lg border border-zinc-200 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-zinc-900"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="organizacion" className="block text-sm font-medium text-zinc-700 mb-2">
                    Organización *
                  </label>
                  <input
                    type="text"
                    id="organizacion"
                    name="organizacion"
                    required
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-zinc-900"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-zinc-900"
                  placeholder="tu@empresa.com"
                />
              </div>

              <div>
                <label htmlFor="remark" className="block text-sm font-medium text-zinc-700 mb-2">
                  Comentarios
                </label>
                <textarea
                  id="remark"
                  name="remark"
                  rows={4}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none text-zinc-900"
                  placeholder="Cuéntanos sobre tu proyecto, área de interés, objetivos y plazos..."
                ></textarea>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  className="mt-1 h-4 w-4 text-blue-600 border-zinc-300 rounded-xs focus:ring-blue-500"
                />
                <label htmlFor="newsletter" className="text-sm text-zinc-600 leading-relaxed">
                  Quiero recibir información sobre nuevos servicios y actualizaciones de Datafield
                </label>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`font-medium py-4 px-6 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    isSubmitting 
                      ? 'bg-zinc-500 cursor-not-allowed' 
                      : 'bg-zinc-900 hover:bg-zinc-800'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Enviar mensaje</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 text-center text-xs text-white/50 bg-black">© {new Date().getFullYear()} Datafield. VANT/SVANT para minería, petróleo y construcción.</footer>
      
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
          >
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Mensaje enviado con éxito!
              </h3>
              
              <p className="text-gray-600 mb-6">
                Gracias por tu consulta. Hemos recibido tu mensaje y nos pondremos en contacto contigo a la brevedad para brindarte toda la información que necesites.
              </p>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ========================================================== */
/* ========================================================== */
/* ========================================================== */
/* ===================== Subcomponentes ===================== */
/* ========================================================== */
/* ========================================================== */
/* ========================================================== */

function BackgroundGrid() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_40%)]" />
      <div className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_20%,black,transparent)] opacity-50">
        <svg className="h-full w-full text-white/5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-white/60 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

function Step({ index, title, desc, icon }: { index: number; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      className="relative pl-10"
    >
      <div className="absolute left-0 top-1.5 h-6 w-6 rounded-xs bg-white text-black grid place-items-center text-xs font-bold">
        {index}
      </div>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-white/70">{icon}</div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="mt-1 text-white/60 text-sm max-w-2xl">{desc}</p>
        </div>
      </div>
    </motion.li>
  );
}

function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 flex items-center">
        <ol className="space-y-10">
          <Step index={1} title="Solicitud y definición de objetivos" desc="Recibimos el requerimiento (sitio, objetivo, plazos). Validamos alcance y proponemos entregables y formatos adecuados para tu área (ingeniería, operaciones, legal)." icon={<Send className="h-4 w-4" />} />
          <Step index={2} title="Plan de vuelo + permisos" desc="Armamos plan de vuelo, zonas, altitudes, solapes y tiempos. Gestionamos permisos, seguros y protocolos de seguridad." icon={<MapIcon className="h-4 w-4" />} />
          <Step index={3} title="Operación aérea en sitio" desc="Pilotos habilitados, checklists y comunicación con HSE. RTK/PPK para precisión centimétrica, vuelos diurnos/nocturnos según necesidad." icon={<Shield className="h-4 w-4" />} />
          <Step index={4} title="Procesamiento" desc="Fotogrametría en RealityCapture y DJI Terra. Generamos ortos, nubes de puntos, DSM/DTM, mallas 3D y reportes de control de calidad." icon={<Layers className="h-4 w-4" />} />
          <Step index={5} title="Análisis y validación" desc="Cubicaciones, comparativas de avance, detección de anomalías térmicas o geométricas. QA con muestras de terreno y metadatos de vuelo." icon={<Ruler className="h-4 w-4" />} />
          <Step index={6} title="Entrega + soporte" desc="Entregamos en GeoTIFF, DXF, LAS/LAZ, OBJ/FBX y reporte ejecutivo. Mesa de soporte para dudas y nuevas iteraciones." icon={<Shield className="h-4 w-4" />} />
        </ol>
      </div>
      <div className="lg:col-span-1 relative">
        {/* Línea de progreso vertical */}
        <div className="sticky top-24 min-h-[calc(100vh-6rem)] flex items-center justify-center">
          
          {/* <div className="relative h-[420px] w-1 bg-white/10 rounded-xs overflow-hidden">
            <motion.div style={{ scaleY: y2 }} className="origin-top absolute left-0 top-0 h-full w-full bg-white/60" />
          </div> */}

          <div className="mt-0 relative w-full max-w-md mx-auto rounded-xs overflow-hidden">
            <div className="pt-[56.25%]"></div>
            <video
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              src="/video-pagina-datafield-640.mp4"
              autoPlay
              muted
              playsInline
              preload="metadata"
              onLoadedMetadata={(e) => {
                try {
                  e.currentTarget.currentTime = 5;
                  e.currentTarget.play().catch(() => {});
                } catch {}
              }}
              onEnded={(e) => {
                try {
                  e.currentTarget.currentTime = 5;
                  e.currentTarget.play().catch(() => {});
                } catch {}
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Deliverable({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      className="rounded-xs border border-white/10 bg-white/[0.03] p-5"
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-xs bg-white/10 grid place-items-center">{icon}</div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="mt-1 text-sm text-white/60">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

function SpecCard({ title, items }: { title: string; items: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      className="rounded-xs border border-white/10 bg-white/[0.03] p-6"
    >
      <h4 className="font-medium">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-white/70">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2"><span className="text-white/30">•</span><span>{t}</span></li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ===================== Nueva sección encapsulada ===================== */

function ApplicationsServices() {
  return (
    <>
      {/* Aplicaciones y Servicios */}
      <section className="relative py-12 bg-gradient-to-b from-black via-zinc-950 to-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Relevamiento y Mapeo */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-semibold mb-4">Relevamiento y Mapeo</h2>
              <p className="text-white/60 max-w-3xl mx-auto">
                Realizamos relevamientos de alta precisión utilizando drones y tecnología LiDAR para generar mapas detallados y modelos 3D.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative overflow-hidden rounded-xs p-6"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                  {/* Sección de la imagen */}
                  <div className="w-full h-48"> {/* Ajusta 'h-48' para controlar la altura de la imagen */}
                    <img
                      src="/Relevamiento Terrestre.jpeg" // Asegúrate de que esta sea la ruta correcta
                      alt="Relevamiento Terrestre"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Sección del contenido (texto y icono) */}
                  <div className="p-6 h-48"> {/* Padding alrededor del contenido */}
                    {/* Icono (si aún lo quieres) */}
                    {/* Nota: si el icono está fuera de la imagen, quizá no necesites el bg-green-500/20 si el fondo ya es blanco */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Relevamiento Terrestre</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Mapeo topográfico de alta precisión para proyectos de ingeniería civil, minería y construcción. Generamos modelos digitales del terreno con precisión centimétrica.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative overflow-hidden rounded-xs p-6"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                  {/* Sección de la imagen */}
                  <div className="w-full h-48"> {/* Ajusta 'h-48' para controlar la altura de la imagen */}
                    <img
                      src="/Relevamiento Catastral.jpg" // Asegúrate de que esta sea la ruta correcta
                      alt="Relevamiento Catastral"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Sección del contenido (texto y icono) */}
                  <div className="p-6 h-48"> {/* Padding alrededor del contenido */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Relevamiento Catastral</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Levantamientos catastrales y delimitación de propiedades rurales y urbanas. Documentación precisa para trámites legales y registrales.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="group relative overflow-hidden rounded-xs p-6"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                  {/* Sección de la imagen */}
                  <div className="w-full h-48"> {/* Ajusta 'h-48' para controlar la altura de la imagen */}
                    <img
                      src="/Planificación Urbana.avif" // Asegúrate de que esta sea la ruta correcta
                      alt="Planificación Urbana"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Sección del contenido (texto y icono) */}
                  <div className="p-6 h-48"> {/* Padding alrededor del contenido */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Planificación Urbana</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Relevamientos urbanos para planificación territorial, desarrollo inmobiliario y proyectos de infraestructura municipal.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Construcción */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-semibold mb-4">Construcción</h2>
              <p className="text-white/60 max-w-3xl mx-auto">
                Hacemos más eficiente el proceso de construcción en todas sus etapas con tecnología de drones y análisis de datos en tiempo real.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative overflow-hidden rounded-xs p-2"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                  {/* Sección de la imagen */}
                  <div className="w-full h-48"> {/* Ajusta 'h-48' para controlar la altura de la imagen */}
                    <img
                      src="/Gestión de Proyectos.jpg" // Asegúrate de que esta sea la ruta correcta
                      alt="Gestión de Proyectos"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Sección del contenido (texto y icono) */}
                  <div className="p-6 h-48"> {/* Padding alrededor del contenido */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Gestión de Proyectos</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Seguimiento de avance de obra, control de cronogramas y documentación visual del progreso constructivo.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative overflow-hidden rounded-xs p-2"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                  {/* Sección de la imagen */}
                  <div className="w-full h-48"> {/* Ajusta 'h-48' para controlar la altura de la imagen */}
                    <img
                      src="/Movimiento de Tierras.jpg" // Asegúrate de que esta sea la ruta correcta
                      alt="Movimiento de Tierras"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Sección del contenido (texto y icono) */}
                  <div className="p-6 h-48"> {/* Padding alrededor del contenido */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Movimiento de Tierras</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Cálculo preciso de volúmenes de corte y relleno, optimización de movimiento de suelos y control de cubicaciones.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="group relative overflow-hidden rounded-xs p-2"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                  {/* Sección de la imagen */}
                  <div className="w-full h-48"> {/* Ajusta 'h-48' para controlar la altura de la imagen */}
                    <img
                      src="/BIM.jpg" // Asegúrate de que esta sea la ruta correcta
                      alt="BIM"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Sección del contenido (texto y icono) */}
                  <div className="p-6 h-48"> {/* Padding alrededor del contenido */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">BIM</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Integración con metodologías BIM, generación de modelos 3D precisos y documentación para todas las disciplinas.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="group relative overflow-hidden rounded-xs p-2"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                  {/* Sección de la imagen */}
                  <div className="w-full h-48"> {/* Ajusta 'h-48' para controlar la altura de la imagen */}
                    <img
                      src="/Preservación Patrimonial.png" // Asegúrate de que esta sea la ruta correcta
                      alt="Preservación Patrimonial"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Sección del contenido (texto y icono) */}
                  <div className="p-6 h-48"> {/* Padding alrededor del contenido */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Preservación Patrimonial</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Documentación 3D de sitios históricos, monitoreo de estructuras patrimoniales y registro de estado de conservación.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Minería */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-semibold mb-4">Minería</h2>
              <p className="text-white/60 max-w-3xl mx-auto">
                Optimizamos operaciones mineras con tecnología de drones para control de inventarios, seguridad y planificación de explotación.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative overflow-hidden rounded-xs p-2"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                  {/* Sección de la imagen */}
                  <div className="w-full h-48"> {/* Ajusta 'h-48' para controlar la altura de la imagen */}
                    <img
                      src="/Relevamiento Minero.jpg" // Asegúrate de que esta sea la ruta correcta
                      alt="Relevamiento Minero"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Sección del contenido (texto y icono) */}
                  <div className="p-6 h-48"> {/* Padding alrededor del contenido */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Relevamiento Minero</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Mapeo de tajos abiertos, control topográfico de avance de explotación y documentación de frentes de trabajo.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative overflow-hidden rounded-xs p-2"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                  {/* Sección de la imagen */}
                  <div className="w-full h-48"> {/* Ajusta 'h-48' para controlar la altura de la imagen */}
                    <img
                      src="/Perforación LiDAR.jpg" // Asegúrate de que esta sea la ruta correcta
                      alt="Perforación LiDAR"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Sección del contenido (texto y icono) */}
                  <div className="p-6 h-48"> {/* Padding alrededor del contenido */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Perforación LiDAR</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Análisis de precisión con tecnología LiDAR para exploración, mapeo de estructuras geológicas y planificación de perforaciones.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="group relative overflow-hidden rounded-xs p-2"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                  {/* Sección de la imagen */}
                  <div className="w-full h-48"> {/* Ajusta 'h-48' para controlar la altura de la imagen */}
                    <img
                      src="/Inspecciones Aéreas.webp" // Asegúrate de que esta sea la ruta correcta
                      alt="Inspecciones Aéreas"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Sección del contenido (texto y icono) */}
                  <div className="p-6 h-48"> {/* Padding alrededor del contenido */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Inspecciones Aéreas</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Monitoreo de seguridad en áreas de difícil acceso, inspección de taludes y detección temprana de riesgos operacionales.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="group relative overflow-hidden rounded-xs p-2"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                  {/* Sección de la imagen */}
                  <div className="w-full h-48"> {/* Ajusta 'h-48' para controlar la altura de la imagen */}
                    <img
                      src="/Seguridad.jpg" // Asegúrate de que esta sea la ruta correcta
                      alt="Seguridad"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Sección del contenido (texto y icono) */}
                  <div className="p-6 h-48"> {/* Padding alrededor del contenido */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Seguridad</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Monitoreo de condiciones de seguridad, detección de anomalías estructurales y evaluación de riesgos en tiempo real.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

/* ===================== Test Cases (no rompen producción) ===================== */
// Ejecuta pruebas simples en el navegador para validar el builder de WhatsApp
if (typeof window !== 'undefined') {
  (function runWhatsAppLinkTests() {
    try {
      // Test 1: saneamiento de número y codificación del mensaje
      const msg1 = 'Hola Datafield, quiero cotizar un servicio';
      const url1 = buildWhatsAppLink(' +54 9 11 1234-5678 ', msg1);
      console.assert(url1.startsWith('https://wa.me/5491112345678?text='), '[Test1] saneamiento de número');
      console.assert(decodeURIComponent(url1.split('=')[1]) === msg1, '[Test1] codificación/decodificación de mensaje');

      // Test 2: caracteres especiales y tildes
      const msg2 = 'Minería/petróleo & construcción? áéíóú ñ %';
      const url2 = buildWhatsAppLink('5491100000000', msg2);
      console.assert(decodeURIComponent(url2.split('=')[1]) === msg2, '[Test2] caracteres especiales');

      // Test 3: entradas vacías
      const url3 = buildWhatsAppLink('', '');
      console.assert(url3 === 'https://wa.me/?text=', '[Test3] valores vacíos');

      // Señal visual en consola
      // eslint-disable-next-line no-console
      console.log('%c[WhatsAppLink][tests] OK', 'color:#10b981');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[WhatsAppLink][tests] ERROR', e);
    }
  })();
}
