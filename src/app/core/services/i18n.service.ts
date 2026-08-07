import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'es' | 'en';

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  es: {
    // nav
    'nav.inicio': 'Inicio',
    'nav.about': 'Quiénes Somos',
    'nav.events': 'Eventos',
    'nav.contact': 'Contáctanos',
    'nav.menu': 'Menú',
    'nav.volunteer': 'Voluntariado',
    'nav.connect': 'Grupos Conexión',
    // home hero
    'home.hero.h1': 'Existimos para\nHonrar a Dios y\nHacer discípulos',
    // Próximos
    'home.hero.btn.events': 'Eventos Realizados',
    'home.hero.btn.about': 'Acerca de nosotros',
    // home about
    'home.about.subhead': 'Bienvenidos a Remanente',
    'home.about.lead': 'La fe en Jesucristo y la comunión fraterna nos unen como una familia. No importa de dónde vengas ni en qué etapa de tu vida te encuentres: aquí tienes un lugar. Nuestro deseo es que encuentres esperanza, paz y propósito a través de la Palabra de Dios.',
    'home.about.btn': 'Más Sobre Remanente',
    // schedule
    'home.sched.title1': 'Servicio Principal de la Iglesia',
    'home.sched.title2': 'Iglesia Infantil',
    'home.sched.title3': 'Reunión de Oración',
    // connect
    'home.connect.vol.h': 'Sé Voluntario con Nosotros.',
    'home.connect.vol.p': 'Selecciona marcar la diferencia sirviendo a otros. Descubre el gozo de ayudar, crecer y formar parte de algo más grande. Juntos podemos reflejar el amor de Cristo en acción.',
    'home.connect.vol.btn': 'Estoy Interesado',
    'home.connect.grp.h': 'Únete a un Grupo de Conexión.',
    'home.connect.grp.p': 'Los Grupos de Conexión son espacios donde compartimos la vida, crecemos en la fe y nos apoyamos mutuamente. No camines solo tu jornada espiritual — únete a una comunidad que te escucha.',
    'home.connect.grp.btn': 'Más Información',
    // events home
    // Próximos
    'home.events.subhead': ' Eventos',
    // el próximo
    'home.events.teaser': 'Conoce los eventos de la iglesia y revive en fotos los que ya compartimos juntos.',
    'home.events.btn': 'Ver Eventos',
    // about
    'about.lead': 'Remanente del Dios Vivo y Eterno es una iglesia en Palmira, Cali, que cree en el poder transformador del evangelio. Somos una familia de fe donde cada persona encuentra un lugar para crecer, servir y conocer más de Dios. Caminamos juntos, generación tras generación, guardando la fe que un día fue dada a los santos.',
    'about.purpose.h': 'Nuestro Propósito.',
    'about.purpose.p': 'Existimos para honrar a Dios y hacer discípulos que reflejen el carácter de Cristo en cada área de su vida. Creemos que cada persona fue creada con un propósito único, y nuestro llamado es acompañarla a descubrirlo a la luz de la Palabra. Por eso invertimos en la enseñanza, la oración y la comunión fraterna.',
    'about.mission.h': 'Nuestra Misión.',
    'about.mission.p': 'Llevar el evangelio de Jesucristo a nuestra ciudad y a las naciones, formando discípulos que amen a Dios sobre todas las cosas y sirvan a su prójimo con humildad. Buscamos ser una iglesia que restaura, sana y levanta familias.',
    'about.verse': 'Porque tanto amó Dios al mundo, que dio a su Hijo unigénito, para que todo el que cree en él no se pierda, sino que tenga vida eterna. Porque Dios no envió a su Hijo al mundo para condenar al mundo, sino para que el mundo sea salvo por medio de él.',
    'about.verse.cite': 'Juan 3:16-17 RVR1960',
    'about.values.h': 'Nuestros Valores.',
    'about.values.1.h': 'Identidad en Cristo',
    'about.values.1.p': 'Sabemos quiénes somos porque sabemos de quién somos. Nuestra identidad no está en lo que hacemos ni en lo que otros dicen de nosotros, sino en ser hijos amados de Dios. Desde ahí servimos, trabajamos y amamos.',
    'about.values.2.h': 'La Iglesia es Familia',
    'about.values.2.p': 'No somos solo una congregación, somos una familia. Nos acompañamos en las alegrías y en las dificultades, llevamos las cargas los unos de los otros y celebramos juntos cada paso de fe. Aquí nadie camina solo.',
    'about.values.3.h': 'Cultura del Reino',
    'about.values.3.p': 'Vivimos con los valores del Reino de Dios por encima de los valores del mundo: la humildad sobre el orgullo, el servicio sobre el protagonismo y la generosidad sobre el egoísmo.',
    'about.values.4.h': 'Vida Guiada por el Espíritu',
    'about.values.4.p': 'Dependemos de la guía diaria del Espíritu Santo, no de fórmulas ni tradiciones vacías. Buscamos escuchar Su voz en la oración, en la Palabra y en la comunidad.',
    'about.believe.h': 'Lo que Creemos.',
    'about.believe.1.h': 'El Amor de Dios es Grande',
    'about.believe.1.p': 'Creemos que el amor de Dios no depende de nuestro desempeño. Él nos amó primero, aun en medio de nuestras faltas, y ese amor es el fundamento de todo lo que somos y hacemos como iglesia.',
    'about.believe.2.h': 'Jesús es el Camino',
    'about.believe.2.p': 'Creemos que Jesucristo es el único camino al Padre, y que a través de Su muerte y resurrección tenemos perdón de pecados y vida eterna. Él es el centro de nuestra fe y de nuestra predicación.',
    'about.believe.3.h': 'El Espíritu Santo Habita en Nosotros',
    'about.believe.3.p': 'Creemos que el Espíritu Santo mora en cada creyente, nos guía a toda verdad y nos capacita con dones para servir a la iglesia y extender el evangelio con poder.',
    'about.believe.4.h': 'La Biblia es la Palabra Viva',
    'about.believe.4.p': 'Creemos que la Biblia es la Palabra inspirada por Dios, verdadera y suficiente para guiar nuestra fe y nuestra conducta. En ella fundamentamos cada enseñanza y cada decisión como iglesia.',
    'about.team.h': 'Conoce a Nuestro Equipo.',
    // events
    'events.section.nextlabel': 'Próximo Evento',
    'events.section.past': 'Eventos que Ya Vivimos',
    'events.cta.photos': 'Ver fotos',
    'events.cta.cost': 'Costo:',
    'events.loading': 'Cargando eventos...',
    'events.empty': 'Aún no hay eventos pasados para mostrar.',
    'events.gallery.loading': 'Cargando fotos...',
    'events.gallery.empty': 'Aún no hay fotos en este álbum.',
    'events.gallery.close': 'Cerrar',
    'events.gallery.prev': 'Foto anterior',
    'events.gallery.next': 'Foto siguiente',
    // volunteer
    'volunteer.title': 'Únete al Equipo',
    'volunteer.lead': 'Servir a los demás es una de las formas más profundas de manifestar el amor de Dios. Cada talento, habilidad y tiempo que dediques tiene un impacto eterno en las vidas de quienes forman parte de nuestra comunidad y nos visitan cada semana.',
    'volunteer.intro': 'No importa tu experiencia previa, creemos que Dios te ha dotado de dones únicos para edificar a la iglesia. Al unirte a uno de nuestros equipos de voluntariado, no solo estarás prestando un servicio, sino también creando lazos de amistad, creciendo espiritualmente y siendo parte activa de la misión que Dios nos ha encomendado.',
    'volunteer.section_title': 'Haz tu Voluntariado en los Siguientes Ministerios',
    'volunteer.ministries.ushering.title': 'Acomodadores y Seguridad',
    'volunteer.ministries.ushering.desc': 'Encargados de dar una cálida bienvenida a cada asistente, orientar a las personas dentro del templo y velar por el orden y la seguridad durante las reuniones.',
    'volunteer.ministries.kids.title': 'Iglesia Infantil (Kids)',
    'volunteer.ministries.kids.desc': 'Enseña y acompaña a los niños en su crecimiento espiritual mediante dinámicas, lecciones bíblicas y actividades creativas diseñadas para su edad.',
    'volunteer.ministries.music.title': 'Equipo de Música y Alabanza',
    'volunteer.ministries.music.desc': 'Lidera a la congregación en momentos de adoración a través de la ejecución instrumental y el canto con excelencia y devoción.',
    'volunteer.ministries.prayer.title': 'Equipo de Intercesión y Oración',
    'volunteer.ministries.prayer.desc': 'Sostiene espiritualmente las reuniones, intercede por las peticiones de la comunidad y ofrece apoyo en oración al finalizar las celebraciones.',
    'volunteer.ministries.admin.title': 'Apoyo Administrativo',
    'volunteer.ministries.admin.desc': 'Ayuda con la organización de eventos, gestión de datos, atención telefónica y tareas logísticas que garantizan el funcionamiento de la iglesia.',
    'volunteer.ministries.production.title': 'Diseño y Producción Visual',
    'volunteer.ministries.production.desc': 'Crea contenido visual, gráficos, escenografía e identidad estética para los servicios, conferencias y redes sociales.',
    'volunteer.ministries.technical.title': 'Técnica y Gestión de Escenario',
    'volunteer.ministries.technical.desc': 'Maneja la consola de audio, la iluminación, las pantallas y la logística técnica del escenario durante los servicios en vivo.',
    'volunteer.ministries.communications.title': 'Comunicaciones y Medios',
    'volunteer.ministries.communications.desc': 'Cubre los eventos mediante fotografía, video, transmisión en vivo y gestión de plataformas digitales para conectar con la comunidad.',
    'volunteer.form.title': '¡Sí, quiero ser voluntario!',
    'volunteer.form.sub': 'Gracias por responder al llamado de servir para honrar a Dios y formar discípulos. Por favor, completa y envía el siguiente formulario.',
    'volunteer.form.name_ph': 'Tu Nombre Completo',
    'volunteer.form.email_ph': 'Tu Correo Electrónico',
    'volunteer.form.phone_ph': 'Número de Teléfono / WhatsApp',
    'volunteer.form.facebook_ph': 'Enlace de Facebook o Red Social',
    'volunteer.form.ministry_label': 'Ministerio en el que deseas colaborar',
    'volunteer.form.first_time_label': '¿Es tu primera vez sirviendo?',
    'volunteer.form.comments_ph': 'Comentarios, preguntas o experiencia previa',
    'volunteer.form.yes': 'Sí',
    'volunteer.form.no': 'No',
    'volunteer.form.submit': 'Enviar Formulario',
    // footer
    'footer.location': 'Nuestra Ubicación',
    'footer.directions': 'Cómo Llegar',
    'footer.quicklinks': 'Enlaces Rápidos',
    'footer.copyright': '© Copyright Remanente 2026',
    'footer.design': 'Diseño por',
    'footer.desc': 'Nuestro propósito es compartir el amor de Cristo y ayudar a otros a crecer en su fe. Este es un lugar para encontrar esperanza, restauración y comunidad.',
  },
  en: {
    // nav
    'nav.inicio': 'Home',
    'nav.about': 'About Us',
    'nav.events': 'Events',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.volunteer': 'Volunteer',
    'nav.connect': 'Connect Groups',
    // home hero
    'home.hero.h1': 'We Exist to\nHonor God and\nMake Disciples',
    'home.hero.btn.events': 'Upcoming Events',
    'home.hero.btn.about': 'About Us',
    // home about
    'home.about.subhead': 'Welcome to Remanente',
    'home.about.lead': 'Faith in Jesus Christ and brotherly fellowship unite us as a family. No matter where you come from or what stage of life you are in: you have a place here. Our desire is that you find hope, peace and purpose through the Word of God.',
    'home.about.btn': 'More About Remanente',
    // schedule
    'home.sched.title1': 'Main Church Service',
    'home.sched.title2': 'Children\'s Church',
    'home.sched.title3': 'Prayer Meeting',
    // connect
    'home.connect.vol.h': 'Volunteer with Us.',
    'home.connect.vol.p': 'Choose to make a difference by serving others. Discover the joy of helping, growing and being part of something bigger. Together we can reflect the love of Christ in action.',
    'home.connect.vol.btn': 'I\'m Interested',
    'home.connect.grp.h': 'Join a Connect Group.',
    'home.connect.grp.p': 'Connect Groups are spaces where we share life, grow in faith and support each other. Don\'t walk your spiritual journey alone — join a community that listens and walks with you.',
    'home.connect.grp.btn': 'More Information',
    // events home
    'home.events.subhead': 'Upcoming Events',
    'home.events.teaser': 'Find out about the next church event and relive in photos the ones we have already shared together.',
    'home.events.btn': 'See Events',
    // about
    'about.lead': 'Remanente del Dios Vivo y Eterno is a church in Palmira, Cali, that believes in the transforming power of the gospel. We are a family of faith where every person finds a place to grow, serve, and know God more. We walk together, generation after generation, keeping the faith once delivered to the saints.',
    'about.purpose.h': 'Our Purpose.',
    'about.purpose.p': 'We exist to honor God and make disciples who reflect the character of Christ in every area of life. We believe every person was created with a unique purpose, and our calling is to accompany them in discovering it through the light of the Word.',
    'about.mission.h': 'Our Mission.',
    'about.mission.p': 'To bring the gospel of Jesus Christ to our city and the nations, forming disciples who love God above all things and serve their neighbors with humility. We seek to be a church that restores, heals and raises up families.',
    'about.verse': 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life. For God sent not his Son into the world to condemn the world; but that the world through him might be saved.',
    'about.verse.cite': 'John 3:16-17 KJV',
    'about.values.h': 'Our Values.',
    'about.values.1.h': 'Identity in Christ',
    'about.values.1.p': 'We know who we are because we know whose we are. Our identity is not in what we do or what others say about us, but in being beloved children of God. From there we serve, work and love.',
    'about.values.2.h': 'The Church is Family',
    'about.values.2.p': 'We are not just a congregation, we are a family. We accompany each other in joys and difficulties, bear one another\'s burdens, and celebrate every step of faith together. No one walks alone here.',
    'about.values.3.h': 'Kingdom Culture',
    'about.values.3.p': 'We live by Kingdom values above the world\'s values: humility over pride, service over the spotlight, and generosity over selfishness.',
    'about.values.4.h': 'Spirit-Led Life',
    'about.values.4.p': 'We depend on the daily guidance of the Holy Spirit, not formulas or empty traditions. We seek to hear His voice in prayer, in the Word, and in community.',
    'about.believe.h': 'What We Believe.',
    'about.believe.1.h': 'God\'s Love is Great',
    'about.believe.1.p': 'We believe that God\'s love does not depend on our performance. He loved us first, even amid our failures, and that love is the foundation of everything we are and do as a church.',
    'about.believe.2.h': 'Jesus is the Way',
    'about.believe.2.p': 'We believe that Jesus Christ is the only way to the Father, and that through His death and resurrection we have forgiveness of sins and eternal life. He is the center of our faith and our preaching.',
    'about.believe.3.h': 'The Holy Spirit Lives in Us',
    'about.believe.3.p': 'We believe the Holy Spirit dwells in every believer, guides us into all truth and equips us with gifts to serve the church and extend the gospel with power.',
    'about.believe.4.h': 'The Bible is the Living Word',
    'about.believe.4.p': 'We believe the Bible is the Word inspired by God, true and sufficient to guide our faith and conduct. We base every teaching and every decision as a church on it.',
    'about.team.h': 'Meet Our Team.',
    // events
    'events.section.nextlabel': 'Next Event',
    'events.section.past': 'Events We Already Lived',
    'events.cta.photos': 'View photos',
    'events.cta.cost': 'Cost:',
    'events.loading': 'Loading events...',
    'events.empty': 'No past events to show yet.',
    'events.gallery.loading': 'Loading photos...',
    'events.gallery.empty': 'No photos in this album yet.',
    'events.gallery.close': 'Close',
    'events.gallery.prev': 'Previous photo',
    'events.gallery.next': 'Next photo',
    // volunteer
    'volunteer.title': 'Join the Team',
    'volunteer.lead': 'Serving others is one of the deepest ways to demonstrate God\'s love. Every talent, skill, and time you dedicate has an eternal impact on the lives of those in our community.',
    'volunteer.intro': 'No matter your previous experience, we believe God has equipped you with unique gifts to build up the church. By joining one of our volunteer teams, you won\'t just be serving — you\'ll build friendships and grow spiritually.',
    'volunteer.section_title': 'Volunteer With Us Through the Following Ministries',
    'volunteer.ministries.ushering.title': 'Ushering & Security',
    'volunteer.ministries.ushering.desc': 'Welcoming attendees, helping people find seats, and ensuring safety and order during service times.',
    'volunteer.ministries.kids.title': 'Kids Church',
    'volunteer.ministries.kids.desc': 'Teaching and guiding children in their spiritual growth through dynamics, Bible lessons, and creative activities.',
    'volunteer.ministries.music.title': 'Music & Worship Team',
    'volunteer.ministries.music.desc': 'Leading the congregation in worship through musical excellence and devotion.',
    'volunteer.ministries.prayer.title': 'Prayer Team',
    'volunteer.ministries.prayer.desc': 'Sustaining meetings spiritually, interceding for prayer requests, and providing prayer support after services.',
    'volunteer.ministries.admin.title': 'Administrative Support',
    'volunteer.ministries.admin.desc': 'Assisting with event organization, data management, and logistical tasks to keep the church running smoothly.',
    'volunteer.ministries.production.title': 'Production & Visual Design',
    'volunteer.ministries.production.desc': 'Creating visual content, graphics, and stage presence for services and digital media.',
    'volunteer.ministries.technical.title': 'Technical & Stage Management',
    'volunteer.ministries.technical.desc': 'Managing audio consoles, lighting, projection screens, and stage mechanics during live services.',
    'volunteer.ministries.communications.title': 'Communications & Media',
    'volunteer.ministries.communications.desc': 'Capturing events through photography, video, livestreams, and social media engagement.',
    'volunteer.form.title': 'Yes, I want to Volunteer!',
    'volunteer.form.sub': 'Thank you for serving with us as we honor God and make disciples. Please fill up and send the form below.',
    'volunteer.form.name_ph': 'Your Full Name',
    'volunteer.form.email_ph': 'Your Email Address',
    'volunteer.form.phone_ph': 'Mobile Number / WhatsApp',
    'volunteer.form.facebook_ph': 'Facebook URL or Social Media',
    'volunteer.form.ministry_label': 'Ministry to volunteer for',
    'volunteer.form.first_time_label': 'This is my first time serving',
    'volunteer.form.comments_ph': 'Comments, questions, or past experience',
    'volunteer.form.yes': 'Yes',
    'volunteer.form.no': 'No',
    'volunteer.form.submit': 'Submit Form',
    // footer
    'footer.location': 'Our Location',
    'footer.directions': 'Get Directions',
    'footer.quicklinks': 'Quick Links',
    'footer.copyright': '© Copyright Remanente 2026',
    'footer.design': 'Design by',
    'footer.desc': 'Our purpose is to share the love of Christ and help others grow in their faith. This is a place to find hope, restoration and community.',
  },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  lang = signal<Lang>('es');

  t(key: string): string {
    return TRANSLATIONS[this.lang()][key] ?? key;
  }

  setLang(l: Lang) {
    this.lang.set(l);
    localStorage.setItem('remanente-lang', l);
  }

  init() {
    const saved = localStorage.getItem('remanente-lang');
    if (saved === 'en' || saved === 'es') this.lang.set(saved);
  }
}
