/* ==========================================================================
   STRABAR — i18n engine (vanilla JS, no framework)
   - Translation dictionary for ES / CA / EN
   - Applies to any element with [data-i18n], [data-i18n-attr]
   - Long-form legal content is handled separately via .i18n-block[data-lang]
   - Persists the chosen language in localStorage
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "strabar_lang";
  const SUPPORTED = ["es", "ca", "en"];
  const DEFAULT_LANG = "es";

  const DICT = {
    es: {
      "meta.title": "Strabar — Tu noche. Tu ruta.",
      "nav.how": "Cómo funciona",
      "nav.explore": "Explorar",
      "nav.demo": "Demo",
      "nav.legal": "Legal",
      "nav.cta": "Probar la demo",
      "nav.skip": "Ir al contenido principal",

      "hero.eyebrow": "Ya disponible · App móvil",
      "hero.title1": "Tu noche.",
      "hero.title2": "Tu ruta.",
      "hero.subtitle":
        "Strabar convierte cada salida en una ruta que puedes registrar, revivir y compartir. Marca los bares que visitas, descubre los recorridos de otros y explora tu ciudad como nunca antes.",
      "hero.ctaPrimary": "Probar la demo",
      "hero.ctaSecondary": "Cómo funciona",
      "hero.meta1v": "4,2 km",
      "hero.meta1l": "Ruta media",
      "hero.meta2v": "1.280+",
      "hero.meta2l": "Strabars registrados*",
      "hero.meta3v": "6",
      "hero.meta3l": "Paradas por noche*",
      "hero.chip1t": "Strabar en curso",
      "hero.chip1s": "3 paradas · 00:42",
      "hero.chip2t": "Beer pace",
      "hero.chip2s": "&lt;1 min/beer",

      "what.eyebrow": "El concepto",
      "what.title": "No es un mapa de bares. Es tu noche, trazada.",
      "what.lede":
        "Strabar registra el recorrido real de tu salida —dónde empezó, por dónde pasó y dónde terminó— y lo convierte en algo que se puede descubrir, comparar y compartir.",
      "what.card1t": "Registra tu ruta",
      "what.card1d": "Activa el GPS al salir y deja que Strabar dibuje tu recorrido en tiempo real.",
      "what.card2t": "Marca cada parada",
      "what.card2d": "Anota los locales que visitas y lleva la cuenta de tu noche a tu manera.",
      "what.card3t": "Descubre otras rutas",
      "what.card3d": "Explora los recorridos que ha hecho la comunidad por tu ciudad.",
      "what.card4t": "Comparte la experiencia",
      "what.card4d": "Convierte tu Strabar en una tarjeta lista para compartir con tus amigos.",

      "how.eyebrow": "Cómo funciona",
      "how.title": "De la puerta de casa a la ronda de recuerdos",
      "how.lede": "Cuatro pasos, pensados para no interrumpir tu noche.",
      "how.step1t": "Sal a la calle",
      "how.step1d": "Abre Strabar cuando arranques el plan. Sin fricción, sin formularios.",
      "how.step2t": "Registra tu recorrido",
      "how.step2d": "El GPS traza tu ruta mientras tú te limitas a disfrutar de la noche.",
      "how.step3t": "Descubre",
      "how.step3d": "Consulta rutas de otros usuarios y encuentra ideas para tu próxima salida.",
      "how.step4t": "Explora más ciudad",
      "how.step4d": "Cada Strabar completado abre nuevos barrios, locales y recomendaciones.",

      "discover.eyebrow": "Explora tu ciudad",
      "discover.title": "Cada ciudad, vista desde sus noches",
      "discover.lede":
        "Rutas, locales populares y zonas con más actividad — así es como Strabar entiende una ciudad.",
      "discover.legendRoute": "Ruta registrada",
      "discover.legendSpot": "Local visitado",
      "discover.legendHot": "Zona con más actividad",
      "discover.stat1v": "128",
      "discover.stat1l": "Locales mapeados*",
      "discover.stat2v": "42 km",
      "discover.stat2l": "Recorridos esta semana*",
      "discover.stat3v": "36 min",
      "discover.stat3l": "Duración media de ruta*",
      "discover.stat4v": "312",
      "discover.stat4l": "Strabars de la comunidad*",
      "discover.note": "*Datos de demostración con fines ilustrativos.",

      "social.eyebrow": "Componente social",
      "social.title": "Construido alrededor de las personas, no solo del mapa",
      "social.lede":
        "Sigue rutas de otros usuarios, descubre qué locales están sonando esta semana y comparte tus propios recorridos con tu comunidad.",
      "social.f1n": "Marta R.",
      "social.f1t": "completó un Strabar de 5 paradas por el Raval.",
      "social.f1b": "Comunidad Strabar",
      "social.f2n": "Jordi P.",
      "social.f2t": "descubrió 2 locales nuevos en Gràcia.",
      "social.f2b": "Actividad privada",
      "social.f3n": "Nia K.",
      "social.f3t": "compartió su ruta \"Poblenou de noche\".",
      "social.f3b": "Comunidad Strabar",
      "social.f4n": "Alex D.",
      "social.f4t": "batió su récord de paradas en una noche: 7.",
      "social.f4b": "Comunidad Strabar",

      "showcase.eyebrow": "La app",
      "showcase.title": "Diseñada para usarse con una mano, de bar en bar",
      "showcase.lede":
        "Interfaz limpia, información al vuelo y una tarjeta de cierre lista para compartir en redes.",

      "demo.eyebrow": "Pruébalo tú mismo",
      "demo.title": "Una pequeña simulación de Strabar",
      "demo.lede":
        "Prueba un adelanto de la app real aquí mismo, sin necesidad de descargarla.",
      "demo.tabTrack": "Registrar una noche",
      "demo.tabFriends": "Ver amigos",
      "demo.stateReady": "Listo para empezar",
      "demo.stateTracking": "GPS activo",
      "demo.stateFinished": "Strabar finalizado",
      "demo.btnStart": "Empezar Strabar",
      "demo.btnBeer": "+ Cerveza",
      "demo.btnFinish": "Finalizar",
      "demo.btnShare": "Compartir Strabar",
      "demo.btnRestart": "Empezar de nuevo",
      "demo.logEmpty": "Tus paradas aparecerán aquí",
      "demo.statDistance": "Distancia",
      "demo.statTime": "Tiempo",
      "demo.statBeers": "Cervezas",
      "demo.statPace": "Beer pace",
      "demo.toastBeer": "¡Parada registrada!",
      "demo.toastShare": "Modo demo: en la app real esto se comparte a Instagram y otras redes.",
      "demo.toastFinish": "Strabar guardado. Así se vería tu resumen.",
      "demo.friendsLede": "Ve a tus amigos en el mapa, pero solo mientras están haciendo un Strabar activo.",
      "demo.friendsOnlineTitle": "Activos ahora mismo",
      "demo.friendsLiveBadge": "EN DIRECTO",
      "demo.friendsPrivacyNote":
        "Solo lo ven los amigos con los que compartes tu ubicación, y solo mientras estás haciendo un Strabar activo.",

      "final.title": "Tu ciudad tiene más noches de las que crees",
      "final.lede": "Descubre, sal y traza tu propia ruta. Empieza por la demo.",
      "final.cta": "Probar la demo ahora",

      "footer.tagline": "Registra tu noche. Descubre tu ciudad. Compártela con quien quieras.",
      "footer.product": "Producto",
      "footer.legal": "Legal",
      "footer.language": "Idioma",
      "footer.privacy": "Política de privacidad",
      "footer.cookies": "Política de cookies",
      "footer.terms": "Términos y condiciones",
      "footer.cookiePrefs": "Preferencias de cookies",
      "footer.copyright": "© 2026 Strabar. Todos los derechos reservados.",

      "cookie.title": "Usamos cookies (las justas)",
      "cookie.text":
        "Utilizamos cookies técnicas necesarias para que la web funcione y, si nos das tu permiso, cookies opcionales para mejorar tu experiencia. Puedes leer más en nuestra",
      "cookie.textLink": "política de cookies",
      "cookie.acceptAll": "Aceptar todas",
      "cookie.rejectAll": "Rechazar no esenciales",
      "cookie.configure": "Configurar",
      "cookie.modalTitle": "Preferencias de cookies",
      "cookie.modalIntro":
        "Elige qué categorías de cookies quieres permitir. Puedes cambiar esta configuración cuando quieras desde el enlace en el pie de página.",
      "cookie.necessaryT": "Necesarias / técnicas",
      "cookie.necessaryD":
        "Imprescindibles para que la web funcione correctamente (por ejemplo, para recordar tus preferencias de cookies e idioma). No se pueden desactivar.",
      "cookie.necessaryStatus": "Siempre activas",
      "cookie.analyticsT": "Analíticas",
      "cookie.analyticsD":
        "Nos ayudarían a entender cómo se usa la web para mejorarla (por ejemplo, páginas más visitadas).",
      "cookie.analyticsStatus": "Actualmente no en uso en esta web",
      "cookie.preferencesT": "Preferencias",
      "cookie.preferencesD": "Permitirían recordar ajustes adicionales de personalización de la interfaz.",
      "cookie.preferencesStatus": "Actualmente no en uso en esta web",
      "cookie.marketingT": "Marketing",
      "cookie.marketingD": "Se usarían para mostrar contenido publicitario relevante en otras plataformas.",
      "cookie.marketingStatus": "Actualmente no en uso en esta web",
      "cookie.save": "Guardar preferencias",
      "cookie.acceptAllModal": "Aceptar todas",
      "cookie.close": "Cerrar",

      "legal.title": "Centro legal",
      "legal.subtitle":
        "Política de privacidad, política de cookies y términos y condiciones de uso de Strabar.",
      "legal.updated": "Última actualización",
      "legal.disclaimer":
        "Este contenido es un borrador base orientativo, pendiente de revisión legal y de completar con los datos definitivos del responsable antes de su publicación oficial. No constituye asesoramiento jurídico.",
      "legal.tabPrivacy": "Privacidad",
      "legal.tabCookies": "Cookies",
      "legal.tabTerms": "Términos",
      "legal.backToTop": "Volver arriba",
    },

    ca: {
      "meta.title": "Strabar — La teva nit. La teva ruta.",
      "nav.how": "Com funciona",
      "nav.explore": "Explorar",
      "nav.demo": "Demo",
      "nav.legal": "Legal",
      "nav.cta": "Prova la demo",
      "nav.skip": "Anar al contingut principal",

      "hero.eyebrow": "Ja disponible · App mòbil",
      "hero.title1": "La teva nit.",
      "hero.title2": "La teva ruta.",
      "hero.subtitle":
        "Strabar converteix cada sortida en una ruta que pots registrar, reviure i compartir. Marca els bars que visites, descobreix els recorreguts d'altres persones i explora la teva ciutat com mai.",
      "hero.ctaPrimary": "Prova la demo",
      "hero.ctaSecondary": "Com funciona",
      "hero.meta1v": "4,2 km",
      "hero.meta1l": "Ruta mitjana",
      "hero.meta2v": "1.280+",
      "hero.meta2l": "Strabars registrats*",
      "hero.meta3v": "6",
      "hero.meta3l": "Parades per nit*",
      "hero.chip1t": "Strabar en curs",
      "hero.chip1s": "3 parades · 00:42",
      "hero.chip2t": "Beer pace",
      "hero.chip2s": "&lt;1 min/beer",

      "what.eyebrow": "El concepte",
      "what.title": "No és un mapa de bars. És la teva nit, traçada.",
      "what.lede":
        "Strabar registra el recorregut real de la teva sortida —on va començar, per on va passar i on va acabar— i el converteix en alguna cosa que es pot descobrir, comparar i compartir.",
      "what.card1t": "Registra la teva ruta",
      "what.card1d": "Activa el GPS en sortir i deixa que Strabar dibuixi el teu recorregut en temps real.",
      "what.card2t": "Marca cada parada",
      "what.card2d": "Anota els locals que visites i porta el compte de la teva nit a la teva manera.",
      "what.card3t": "Descobreix altres rutes",
      "what.card3d": "Explora els recorreguts que ha fet la comunitat per la teva ciutat.",
      "what.card4t": "Comparteix l'experiència",
      "what.card4d": "Converteix el teu Strabar en una targeta llesta per compartir amb els amics.",

      "how.eyebrow": "Com funciona",
      "how.title": "De la porta de casa a la ronda de records",
      "how.lede": "Quatre passos, pensats per no interrompre la teva nit.",
      "how.step1t": "Surt al carrer",
      "how.step1d": "Obre Strabar quan comenci el pla. Sense fricció, sense formularis.",
      "how.step2t": "Registra el teu recorregut",
      "how.step2d": "El GPS traça la ruta mentre tu et limites a gaudir de la nit.",
      "how.step3t": "Descobreix",
      "how.step3d": "Consulta rutes d'altres usuaris i troba idees per a la teva propera sortida.",
      "how.step4t": "Explora més ciutat",
      "how.step4d": "Cada Strabar completat obre nous barris, locals i recomanacions.",

      "discover.eyebrow": "Explora la teva ciutat",
      "discover.title": "Cada ciutat, vista des de les seves nits",
      "discover.lede":
        "Rutes, locals populars i zones amb més activitat — així és com Strabar entén una ciutat.",
      "discover.legendRoute": "Ruta registrada",
      "discover.legendSpot": "Local visitat",
      "discover.legendHot": "Zona amb més activitat",
      "discover.stat1v": "128",
      "discover.stat1l": "Locals mapejats*",
      "discover.stat2v": "42 km",
      "discover.stat2l": "Recorreguts aquesta setmana*",
      "discover.stat3v": "36 min",
      "discover.stat3l": "Durada mitjana de ruta*",
      "discover.stat4v": "312",
      "discover.stat4l": "Strabars de la comunitat*",
      "discover.note": "*Dades de demostració amb finalitats il·lustratives.",

      "social.eyebrow": "Component social",
      "social.title": "Construït al voltant de les persones, no només del mapa",
      "social.lede":
        "Segueix rutes d'altres usuaris, descobreix quins locals sonen aquesta setmana i comparteix els teus propis recorreguts amb la teva comunitat.",
      "social.f1n": "Marta R.",
      "social.f1t": "va completar un Strabar de 5 parades pel Raval.",
      "social.f1b": "Comunitat Strabar",
      "social.f2n": "Jordi P.",
      "social.f2t": "va descobrir 2 locals nous a Gràcia.",
      "social.f2b": "Activitat privada",
      "social.f3n": "Nia K.",
      "social.f3t": "va compartir la seva ruta \"Poblenou de nit\".",
      "social.f3b": "Comunitat Strabar",
      "social.f4n": "Alex D.",
      "social.f4t": "va batre el seu rècord de parades en una nit: 7.",
      "social.f4b": "Comunitat Strabar",

      "showcase.eyebrow": "L'app",
      "showcase.title": "Dissenyada per usar-se amb una mà, de bar en bar",
      "showcase.lede":
        "Interfície neta, informació al vol i una targeta de tancament llesta per compartir a xarxes.",

      "demo.eyebrow": "Prova-ho tu mateix",
      "demo.title": "Una petita simulació de Strabar",
      "demo.lede":
        "Prova un tast de l'app real aquí mateix, sense necessitat de descarregar-la.",
      "demo.tabTrack": "Registrar una nit",
      "demo.tabFriends": "Veure amics",
      "demo.stateReady": "Llest per començar",
      "demo.stateTracking": "GPS actiu",
      "demo.stateFinished": "Strabar finalitzat",
      "demo.btnStart": "Començar Strabar",
      "demo.btnBeer": "+ Cervesa",
      "demo.btnFinish": "Finalitzar",
      "demo.btnShare": "Compartir Strabar",
      "demo.btnRestart": "Tornar a començar",
      "demo.logEmpty": "Les teves parades apareixeran aquí",
      "demo.statDistance": "Distància",
      "demo.statTime": "Temps",
      "demo.statBeers": "Cerveses",
      "demo.statPace": "Beer pace",
      "demo.toastBeer": "Parada registrada!",
      "demo.toastShare": "Mode demo: a l'app real això es comparteix a Instagram i altres xarxes.",
      "demo.toastFinish": "Strabar desat. Així es veuria el teu resum.",
      "demo.friendsLede": "Consulta on són els teus amics al mapa, però només mentre estan fent un Strabar actiu.",
      "demo.friendsOnlineTitle": "Actius ara mateix",
      "demo.friendsLiveBadge": "EN DIRECTE",
      "demo.friendsPrivacyNote":
        "Només ho veuen els amics amb qui comparteixes la teva ubicació, i només mentre estàs fent un Strabar actiu.",

      "final.title": "La teva ciutat té més nits de les que et penses",
      "final.lede": "Descobreix, surt i traça la teva pròpia ruta. Comença per la demo.",
      "final.cta": "Prova la demo ara",

      "footer.tagline": "Registra la teva nit. Descobreix la teva ciutat. Comparteix-la amb qui vulguis.",
      "footer.product": "Producte",
      "footer.legal": "Legal",
      "footer.language": "Idioma",
      "footer.privacy": "Política de privacitat",
      "footer.cookies": "Política de cookies",
      "footer.terms": "Termes i condicions",
      "footer.cookiePrefs": "Preferències de cookies",
      "footer.copyright": "© 2026 Strabar. Tots els drets reservats.",

      "cookie.title": "Utilitzem cookies (les justes)",
      "cookie.text":
        "Utilitzem cookies tècniques necessàries perquè el lloc funcioni i, si ens ho permets, cookies opcionals per millorar la teva experiència. Pots llegir més a la nostra",
      "cookie.textLink": "política de cookies",
      "cookie.acceptAll": "Acceptar totes",
      "cookie.rejectAll": "Rebutjar no essencials",
      "cookie.configure": "Configurar",
      "cookie.modalTitle": "Preferències de cookies",
      "cookie.modalIntro":
        "Tria quines categories de cookies vols permetre. Pots canviar aquesta configuració quan vulguis des de l'enllaç al peu de pàgina.",
      "cookie.necessaryT": "Necessàries / tècniques",
      "cookie.necessaryD":
        "Imprescindibles perquè el lloc funcioni correctament (per exemple, per recordar les teves preferències de cookies i idioma). No es poden desactivar.",
      "cookie.necessaryStatus": "Sempre actives",
      "cookie.analyticsT": "Analítiques",
      "cookie.analyticsD":
        "Ens ajudarien a entendre com s'utilitza el lloc per millorar-lo (per exemple, pàgines més visitades).",
      "cookie.analyticsStatus": "Actualment no s'utilitzen en aquest lloc",
      "cookie.preferencesT": "Preferències",
      "cookie.preferencesD": "Permetrien recordar ajustos addicionals de personalització de la interfície.",
      "cookie.preferencesStatus": "Actualment no s'utilitzen en aquest lloc",
      "cookie.marketingT": "Màrqueting",
      "cookie.marketingD": "S'utilitzarien per mostrar contingut publicitari rellevant en altres plataformes.",
      "cookie.marketingStatus": "Actualment no s'utilitzen en aquest lloc",
      "cookie.save": "Desar preferències",
      "cookie.acceptAllModal": "Acceptar totes",
      "cookie.close": "Tancar",

      "legal.title": "Centre legal",
      "legal.subtitle":
        "Política de privacitat, política de cookies i termes i condicions d'ús de Strabar.",
      "legal.updated": "Última actualització",
      "legal.disclaimer":
        "Aquest contingut és un esborrany base orientatiu, pendent de revisió legal i de completar amb les dades definitives del responsable abans de la seva publicació oficial. No constitueix assessorament jurídic.",
      "legal.tabPrivacy": "Privacitat",
      "legal.tabCookies": "Cookies",
      "legal.tabTerms": "Termes",
      "legal.backToTop": "Tornar amunt",
    },

    en: {
      "meta.title": "Strabar — Your night. Your route.",
      "nav.how": "How it works",
      "nav.explore": "Explore",
      "nav.demo": "Demo",
      "nav.legal": "Legal",
      "nav.cta": "Try the demo",
      "nav.skip": "Skip to main content",

      "hero.eyebrow": "Available now · Mobile app",
      "hero.title1": "Your night.",
      "hero.title2": "Your route.",
      "hero.subtitle":
        "Strabar turns every night out into a route you can record, relive and share. Log the bars you visit, discover other people's routes, and explore your city like never before.",
      "hero.ctaPrimary": "Try the demo",
      "hero.ctaSecondary": "How it works",
      "hero.meta1v": "4.2 km",
      "hero.meta1l": "Average route",
      "hero.meta2v": "1,280+",
      "hero.meta2l": "Strabars logged*",
      "hero.meta3v": "6",
      "hero.meta3l": "Stops per night*",
      "hero.chip1t": "Strabar in progress",
      "hero.chip1s": "3 stops · 00:42",
      "hero.chip2t": "Beer pace",
      "hero.chip2s": "&lt;1 min/beer",

      "what.eyebrow": "The concept",
      "what.title": "Not a map of bars. Your night, traced.",
      "what.lede":
        "Strabar records the real route of your night out — where it started, where it went, where it ended — and turns it into something you can discover, compare and share.",
      "what.card1t": "Track your route",
      "what.card1d": "Turn on GPS when you head out and let Strabar draw your route in real time.",
      "what.card2t": "Log every stop",
      "what.card2d": "Mark the places you visit and keep count of your night, your way.",
      "what.card3t": "Discover other routes",
      "what.card3d": "Browse the routes the community has taken around your city.",
      "what.card4t": "Share the experience",
      "what.card4d": "Turn your Strabar into a card that's ready to share with your friends.",

      "how.eyebrow": "How it works",
      "how.title": "From your front door to the stories you'll tell",
      "how.lede": "Four steps, designed to never get in the way of your night.",
      "how.step1t": "Go out",
      "how.step1d": "Open Strabar the moment the plan starts. No friction, no forms.",
      "how.step2t": "Track your route",
      "how.step2d": "GPS traces your path while you focus on the night itself.",
      "how.step3t": "Discover",
      "how.step3d": "Browse other users' routes and get ideas for your next night out.",
      "how.step4t": "Explore more city",
      "how.step4d": "Every finished Strabar unlocks new neighbourhoods, spots and recommendations.",

      "discover.eyebrow": "Explore your city",
      "discover.title": "Every city, seen through its nights",
      "discover.lede":
        "Routes, popular spots, and the areas with the most activity — that's how Strabar reads a city.",
      "discover.legendRoute": "Logged route",
      "discover.legendSpot": "Visited spot",
      "discover.legendHot": "High-activity area",
      "discover.stat1v": "128",
      "discover.stat1l": "Spots mapped*",
      "discover.stat2v": "42 km",
      "discover.stat2l": "Routes this week*",
      "discover.stat3v": "36 min",
      "discover.stat3l": "Average route length*",
      "discover.stat4v": "312",
      "discover.stat4l": "Community Strabars*",
      "discover.note": "*Sample data for illustration purposes.",

      "social.eyebrow": "Social by design",
      "social.title": "Built around people, not just the map",
      "social.lede":
        "Follow other users' routes, see which spots are trending this week, and share your own nights with your community.",
      "social.f1n": "Marta R.",
      "social.f1t": "completed a 5-stop Strabar around Raval.",
      "social.f1b": "Strabar community",
      "social.f2n": "Jordi P.",
      "social.f2t": "discovered 2 new spots in Gràcia.",
      "social.f2b": "Private activity",
      "social.f3n": "Nia K.",
      "social.f3t": "shared their route \"Poblenou after dark\".",
      "social.f3b": "Strabar community",
      "social.f4n": "Alex D.",
      "social.f4t": "set a new personal record: 7 stops in one night.",
      "social.f4b": "Strabar community",

      "showcase.eyebrow": "The app",
      "showcase.title": "Built for one-handed use, bar to bar",
      "showcase.lede":
        "A clean interface, information at a glance, and a closing card that's ready to post.",

      "demo.eyebrow": "Try it yourself",
      "demo.title": "A small simulation of Strabar",
      "demo.lede":
        "Get a taste of the real app right here — no download required.",
      "demo.tabTrack": "Track a night",
      "demo.tabFriends": "See friends",
      "demo.stateReady": "Ready to start",
      "demo.stateTracking": "GPS active",
      "demo.stateFinished": "Strabar finished",
      "demo.btnStart": "Start Strabar",
      "demo.btnBeer": "+ Beer",
      "demo.btnFinish": "Finish",
      "demo.btnShare": "Share Strabar",
      "demo.btnRestart": "Start over",
      "demo.logEmpty": "Your stops will show up here",
      "demo.statDistance": "Distance",
      "demo.statTime": "Time",
      "demo.statBeers": "Beers",
      "demo.statPace": "Beer pace",
      "demo.toastBeer": "Stop logged!",
      "demo.toastShare": "Demo mode: in the real app this shares straight to Instagram and other apps.",
      "demo.toastFinish": "Strabar saved. This is what your summary would look like.",
      "demo.friendsLede": "See your friends on the map — but only while they're out on an active Strabar.",
      "demo.friendsOnlineTitle": "Out right now",
      "demo.friendsLiveBadge": "LIVE",
      "demo.friendsPrivacyNote":
        "Only visible to friends who've accepted to share, and only while they're actively tracking a Strabar.",

      "final.title": "Your city has more nights in it than you think",
      "final.lede": "Discover, go out, and trace your own route. Start with the demo.",
      "final.cta": "Try the demo now",

      "footer.tagline": "Track your night. Discover your city. Share it with whoever you want.",
      "footer.product": "Product",
      "footer.legal": "Legal",
      "footer.language": "Language",
      "footer.privacy": "Privacy Policy",
      "footer.cookies": "Cookie Policy",
      "footer.terms": "Terms of Use",
      "footer.cookiePrefs": "Cookie preferences",
      "footer.copyright": "© 2026 Strabar. All rights reserved.",

      "cookie.title": "We use cookies (just the essential ones)",
      "cookie.text":
        "We use necessary technical cookies to make the site work and, with your permission, optional cookies to improve your experience. Read more in our",
      "cookie.textLink": "cookie policy",
      "cookie.acceptAll": "Accept all",
      "cookie.rejectAll": "Reject non-essential",
      "cookie.configure": "Configure",
      "cookie.modalTitle": "Cookie preferences",
      "cookie.modalIntro":
        "Choose which cookie categories to allow. You can change this setting at any time from the link in the footer.",
      "cookie.necessaryT": "Necessary / technical",
      "cookie.necessaryD":
        "Required for the site to work correctly (for example, remembering your cookie and language preferences). These cannot be disabled.",
      "cookie.necessaryStatus": "Always active",
      "cookie.analyticsT": "Analytics",
      "cookie.analyticsD":
        "Would help us understand how the site is used so we can improve it (e.g. most visited pages).",
      "cookie.analyticsStatus": "Currently not in use on this site",
      "cookie.preferencesT": "Preferences",
      "cookie.preferencesD": "Would remember additional interface personalisation settings.",
      "cookie.preferencesStatus": "Currently not in use on this site",
      "cookie.marketingT": "Marketing",
      "cookie.marketingD": "Would be used to show relevant advertising content on other platforms.",
      "cookie.marketingStatus": "Currently not in use on this site",
      "cookie.save": "Save preferences",
      "cookie.acceptAllModal": "Accept all",
      "cookie.close": "Close",

      "legal.title": "Legal centre",
      "legal.subtitle": "Privacy Policy, Cookie Policy, and Terms of Use for Strabar.",
      "legal.updated": "Last updated",
      "legal.disclaimer":
        "This content is a base draft for guidance only, pending legal review and completion with the controller's final details before official publication. It does not constitute legal advice.",
      "legal.tabPrivacy": "Privacy",
      "legal.tabCookies": "Cookies",
      "legal.tabTerms": "Terms",
      "legal.backToTop": "Back to top",
    },
  };

  function detectInitialLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const nav = (navigator.language || DEFAULT_LANG).toLowerCase();
    if (nav.startsWith("ca")) return "ca";
    if (nav.startsWith("en")) return "en";
    if (nav.startsWith("es")) return "es";
    return DEFAULT_LANG;
  }

  let currentLang = detectInitialLang();

  function t(key) {
    return (DICT[currentLang] && DICT[currentLang][key]) || (DICT[DEFAULT_LANG] || {})[key] || key;
  }

  function applyTranslations(root) {
    const scope = root || document;

    scope.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = t(key);
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    scope.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      try {
        const map = JSON.parse(el.getAttribute("data-i18n-attr"));
        Object.keys(map).forEach((attr) => {
          el.setAttribute(attr, t(map[attr]));
        });
      } catch (e) {
        /* ignore malformed attr map */
      }
    });

    scope.querySelectorAll(".i18n-block").forEach((el) => {
      el.style.display = el.getAttribute("data-lang") === currentLang ? "" : "none";
    });

    document.documentElement.setAttribute("lang", currentLang);
    document.title = t("meta.title");
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations();
    document.querySelectorAll("[data-lang-option]").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang-option") === lang;
      btn.setAttribute("aria-checked", String(isActive));
      btn.setAttribute("aria-current", String(isActive));
    });
    document.dispatchEvent(new CustomEvent("strabar:langchange", { detail: { lang } }));
  }

  function getLang() {
    return currentLang;
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTranslations();

    document.querySelectorAll("[data-lang-option]").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang-option")));
    });
  });

  window.StrabarI18n = { t, setLang, getLang, SUPPORTED };
})();
