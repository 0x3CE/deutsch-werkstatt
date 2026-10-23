/* Deutsch-Werkstatt — allemand A1 → B1 avec Claude, le micro et la voix.
   Tout tourne dans le navigateur : la clé API et la progression restent sur l'appareil,
   les appels partent directement vers api.anthropic.com. */
"use strict";

/* ============================================================
   Programme : A1 (révision) → A2 → B1, B2 en aperçu.
   Départ le lundi 2 novembre 2026 (modifiable dans Réglages).
   ============================================================ */
const DEFAULT_START = "2026-11-02";
const UNITS = [
  { id: "A1.1", lvl: "A1", w: 2, title: "Sich vorstellen", theme: "se présenter, nationalité, métier, langues", gram: ["Präsens : verbes réguliers", "sein et haben", "questions avec W-"], can: "Je me présente et je pose des questions simples sur l'autre." },
  { id: "A1.2", lvl: "A1", w: 2, title: "Familie und Freunde", theme: "famille, amis, âge, description", gram: ["articles der / die / das", "articles possessifs (mein, dein…)", "nominatif et accusatif"], can: "Je parle de ma famille et de mes proches." },
  { id: "A1.3", lvl: "A1", w: 2, title: "Essen und Einkaufen", theme: "courses, prix, quantités, restaurant", gram: ["accusatif (einen, keinen)", "möchten", "quantités et prix"], can: "Je fais mes courses et je commande au restaurant." },
  { id: "A1.4", lvl: "A1", w: 2, title: "Mein Tag", theme: "journée, heure, horaires de travail", gram: ["verbes séparables", "l'heure", "verbe en 2e position, inversion"], can: "Je décris ma journée et je donne l'heure." },
  { id: "A1.5", lvl: "A1", w: 1, title: "Freizeit und Sport", theme: "loisirs, sport, week-end", gram: ["verbes de modalité : können, wollen, müssen", "gern, lieber, am liebsten"], can: "Je parle de mes loisirs et de ce que je sais faire." },
  { id: "A1.6", lvl: "A1", w: 1, title: "Wohnen", theme: "logement, pièces, meubles", gram: ["datif : introduction", "es gibt", "adjectifs attributs"], can: "Je décris mon logement." },
  { id: "A1.7", lvl: "A1", w: 1, title: "In der Stadt", theme: "ville, chemin, transports", gram: ["impératif", "prépositions + datif (mit, zu, bei…)"], can: "Je demande et j'indique un chemin." },
  { id: "A1.8", lvl: "A1", w: 2, title: "Was hast du gemacht?", theme: "week-end passé, souvenirs", gram: ["Perfekt avec haben et sein", "participes passés réguliers et irréguliers"], can: "Je raconte simplement ce que j'ai fait." },

  { id: "A2.1", lvl: "A2", w: 2, title: "Arbeit und Beruf", theme: "métier, tâches, collègues", gram: ["Perfekt (approfondi)", "subordonnées avec weil et dass"], can: "Je décris mon travail et je justifie mes choix." },
  { id: "A2.2", lvl: "A2", w: 2, title: "Bewerbung und Lebenslauf", theme: "CV, parcours, candidature", gram: ["Präteritum de sein, haben et des verbes de modalité", "dates et durées (seit, vor, für)"], can: "Je présente mon parcours professionnel." },
  { id: "A2.3", lvl: "A2", w: 2, title: "Wohnungssuche", theme: "annonce, visite, loyer, caution (Suisse)", gram: ["prépositions mixtes (accusatif / datif)", "legen / liegen, stellen / stehen, hängen"], can: "Je comprends une annonce et je pose des questions lors d'une visite." },
  { id: "A2.4", lvl: "A2", w: 1, title: "Behörden und Anmeldung", theme: "commune, permis, assurance maladie", gram: ["e-mail formel, forme Sie", "demandes polies : könnten Sie…, ich hätte gern…"], can: "Je fais une démarche administrative simple par écrit et à l'oral." },
  { id: "A2.5", lvl: "A2", w: 2, title: "Gesundheit", theme: "corps, médecin, pharmacie", gram: ["verbes pronominaux (sich)", "sollen", "conseils"], can: "J'explique un problème de santé simple." },
  { id: "A2.6", lvl: "A2", w: 1, title: "Unterwegs", theme: "train, transports publics, voyage", gram: ["comparatif et superlatif", "prépositions de temps"], can: "J'achète un billet et je compare des options de voyage." },
  { id: "A2.7", lvl: "A2", w: 2, title: "Einkaufen und Kleidung", theme: "vêtements, magasins, réclamations simples", gram: ["déclinaison de l'adjectif après l'article défini"], can: "Je décris et je choisis des produits." },
  { id: "A2.8", lvl: "A2", w: 1, title: "Feste und Einladungen", theme: "invitations, cadeaux, fêtes suisses", gram: ["verbes + datif (gefallen, helfen, gehören)", "pronoms personnels au datif"], can: "J'invite quelqu'un et je réponds à une invitation." },
  { id: "A2.9", lvl: "A2", w: 2, title: "Medien und Technik", theme: "ordinateur, appli, données, réseaux", gram: ["déclinaison de l'adjectif après l'article indéfini", "subordonnée avec wenn"], can: "Je parle de mes usages numériques." },
  { id: "A2.10", lvl: "A2", w: 1, title: "Natur und Wetter", theme: "météo, montagne, randonnée, saisons", gram: ["Konjunktiv II : würde, hätte, wäre (souhaits)"], can: "J'exprime des souhaits et je parle de la météo." },
  { id: "A2.11", lvl: "A2", w: 1, title: "Kommunikation im Büro", theme: "réunions, rendez-vous, téléphone", gram: ["interrogatives indirectes (ob, W-)", "fixer un rendez-vous"], can: "Je fixe un rendez-vous et je gère un appel simple." },
  { id: "A2.12", lvl: "A2", w: 2, title: "Prüfungstraining A2", theme: "examen Goethe A2 : Lesen, Hören, Schreiben, Sprechen", gram: ["révision générale", "stratégies d'examen"], can: "Je suis prêt pour les 4 modules de l'examen A2." },

  { id: "B1.1", lvl: "B1", w: 3, title: "Erfahrungen und Lebenslauf", theme: "expériences, étapes de vie", gram: ["Präteritum (réguliers et irréguliers)", "Plusquamperfekt"], can: "Je raconte une expérience de façon détaillée." },
  { id: "B1.2", lvl: "B1", w: 3, title: "Arbeitswelt Schweiz", theme: "entreprise, équipe, culture de travail en Suisse", gram: ["subordonnées relatives (nominatif, accusatif, datif)"], can: "Je décris mon équipe et mon entreprise avec précision." },
  { id: "B1.3", lvl: "B1", w: 3, title: "Meinungen äußern", theme: "débat, avantages et inconvénients", gram: ["connecteurs : deshalb, trotzdem, obwohl", "structure de la phrase"], can: "Je donne mon avis et je l'argumente." },
  { id: "B1.4", lvl: "B1", w: 2, title: "Technik und Umwelt", theme: "énergie, robotique, environnement", gram: ["passif au présent et au Präteritum"], can: "J'explique un processus technique simple." },
  { id: "B1.5", lvl: "B1", w: 3, title: "Pläne und Ziele", theme: "projets, carrière, formation", gram: ["Futur I", "infinitive avec zu", "um … zu et damit"], can: "Je parle de mes projets et de mes objectifs." },
  { id: "B1.6", lvl: "B1", w: 3, title: "Gesellschaft", theme: "vivre ensemble, voisinage, règles", gram: ["génitif", "wegen, trotz, während"], can: "Je comprends et commente des règles de vie en société." },
  { id: "B1.7", lvl: "B1", w: 3, title: "Probleme lösen", theme: "réclamations, imprévus, service client", gram: ["Konjunktiv II du passé", "demandes polies avancées"], can: "Je règle un problème et je formule une réclamation." },
  { id: "B1.8", lvl: "B1", w: 3, title: "Präsentieren", theme: "présenter un projet, une démo technique", gram: ["verbes à préposition (sich freuen auf / über…)", "da- et wo- (darauf, worüber)"], can: "Je présente un projet et je réponds aux questions." },
  { id: "B1.9", lvl: "B1", w: 2, title: "Schweizer Alltag", theme: "helvétismes, suisse allemand (le reconnaître), usages", gram: ["helvétismes : Velo, parkieren, Znüni, grüezi…", "comprendre le Schweizerdeutsch courant"], can: "Je comprends les mots et usages typiques de Suisse alémanique." },
  { id: "B1.10", lvl: "B1", w: 2, title: "Prüfungstraining B1", theme: "examen Goethe B1 : les 4 modules", gram: ["révision générale", "stratégies d'examen"], can: "Je suis prêt à tenter le B1." },

  { id: "B2.1", lvl: "B2", w: 0, title: "Diskutieren und verhandeln", theme: "négociation, réunion, compromis", gram: ["Konjunktiv I (discours rapporté)", "nominalisation"], can: "Je mène une discussion professionnelle." },
  { id: "B2.2", lvl: "B2", w: 0, title: "Fachsprache Technik", theme: "vocabulaire technique, architecture, incidents", gram: ["participes I et II comme adjectifs", "passif avec verbes de modalité"], can: "J'explique un système technique en allemand." },
  { id: "B2.3", lvl: "B2", w: 0, title: "Texte schreiben", theme: "rapports, e-mails formels longs", gram: ["connecteurs avancés", "registre formel"], can: "Je rédige un rapport structuré." },
  { id: "B2.4", lvl: "B2", w: 0, title: "Prüfungstraining B2", theme: "examen Goethe B2", gram: ["révision générale"], can: "Je suis prêt pour le B2." }
];
const LEVEL_NAMES = { A1: "A1 · révision", A2: "A2", B1: "B1", B2: "B2 · après l'installation" };
const LEVEL_INFO = { A1: "débutant", A2: "élémentaire", B1: "intermédiaire", B2: "avancé" };
const WRITE_LEN = { A1: [20, 30], A2: [30, 40], B1: [80, 100], B2: [150, 180] };
const READ_LEN = { A1: "60 à 90", A2: "90 à 130", B1: "150 à 200", B2: "220 à 280" };
const WEEK_PLAN = [
  { tab: "schreiben", t: "Schreiben", d: "Une rédaction corrigée (30 min)." },
  { tab: "kurs", t: "Kurs", d: "La leçon de l'unité en cours : explication, exemples, dialogue." },
  { tab: "wortschatz", t: "Wortschatz + Hören", d: "15 min de cartes, puis un texte à écouter." },
  { tab: "gespraech", t: "Gespräch", d: "20 min de conversation à voix haute, puis 10 min de cartes." },
  { tab: "uebungen", t: "Übungen", d: "Exercices sur la grammaire de l'unité." },
  { tab: "sprechen", t: "Sprechen", d: "Répéter des phrases, puis un monologue type examen." },
  { tab: "heute", t: "Pause", d: "Samedi : pas d'allemand prévu, la série continue." }
];
const SCENARIOS = [
  { id: "buero", t: "Premier jour au bureau", d: "Zurich, nouvelle équipe", p: "Tu es une collègue (Lena) qui accueille l'apprenant pour son premier jour dans une entreprise tech à Zurich." },
  { id: "interview", t: "Entretien d'embauche", d: "Poste technique", p: "Tu es la responsable d'équipe qui fait passer un entretien d'embauche pour un poste technique. Pose des questions sur le parcours, les projets et les motivations." },
  { id: "wohnung", t: "Visite d'appartement", d: "Annonce, loyer, caution", p: "Tu es la régie (Verwaltung) qui fait visiter un appartement de 2,5 pièces à Zurich. Réponds aux questions sur le loyer, les charges (Nebenkosten), la caution et la date d'entrée." },
  { id: "gemeinde", t: "Annonce à la commune", d: "Arrivée, permis B", p: "Tu es l'employé du contrôle des habitants (Einwohnerkontrolle) qui enregistre l'arrivée de l'apprenant. Demande les documents nécessaires." },
  { id: "bahn", t: "À la gare", d: "Billet, abonnement, horaires", p: "Tu es l'employé du guichet d'une gare suisse. L'apprenant veut un billet ou un abonnement." },
  { id: "arzt", t: "Chez le médecin", d: "Symptômes, conseils", p: "Tu es le médecin généraliste. L'apprenant décrit des symptômes simples." },
  { id: "mittag", t: "Déjeuner entre collègues", d: "Small talk, week-end, sport", p: "Tu es un collègue sympa au déjeuner. Parle du week-end, du sport, de la montagne, de la Suisse." },
  { id: "standup", t: "Daily stand-up", d: "Tâches, blocages, plan", p: "Tu animes le daily stand-up d'une équipe tech. Demande à l'apprenant ce qu'il a fait hier, ce qu'il fait aujourd'hui et s'il a des blocages." },
  { id: "planen", t: "Organiser ensemble", d: "Examen A2 · Sprechen Teil 3", p: "Tu es un ami de l'apprenant. Vous devez organiser ensemble une activité (un cadeau pour un collègue, une sortie, un repas). Propose des idées et des créneaux, négocie, et arrivez à un accord, comme à l'épreuve orale du Goethe A2." },
  { id: "frei", t: "Conversation libre", d: "Le sujet que tu veux", p: "Tu es un partenaire de conversation amical. Laisse l'apprenant choisir le sujet." }
];
const HOEREN_THEMES = ["Une journée de travail à Zurich", "Une annonce à la gare", "Un message vocal d'un collègue", "Une annonce d'appartement", "La météo en montagne", "Un week-end de randonnée", "Un article sur les robots d'inspection", "Une invitation à une fête d'équipe", "Les règles d'un immeuble suisse", "Un rendez-vous chez le médecin"];
const NACH_BASE = [
  ["Ich komme aus Frankreich und lerne Deutsch.", "Je viens de France et j'apprends l'allemand."],
  ["Wo ist hier der Bahnhof, bitte?", "Où est la gare, s'il vous plaît ?"],
  ["Ich hätte gern ein Billett nach Zürich.", "Je voudrais un billet pour Zurich."],
  ["Am Wochenende gehe ich gern in die Berge.", "Le week-end, j'aime aller en montagne."],
  ["Können Sie das bitte langsamer sagen?", "Pouvez-vous le dire plus lentement, s'il vous plaît ?"],
  ["Ich arbeite als Ingenieur in einem kleinen Team.", "Je travaille comme ingénieur dans une petite équipe."],
  ["Die Wohnung hat zweieinhalb Zimmer und einen Balkon.", "L'appartement a deux pièces et demie et un balcon."],
  ["Wann fährt der nächste Zug nach Bern?", "Quand part le prochain train pour Berne ?"],
  ["Ich habe am Montag um neun Uhr einen Termin.", "J'ai un rendez-vous lundi à neuf heures."],
  ["Wir treffen uns morgen vor dem Büro.", "On se retrouve demain devant le bureau."],
  ["Entschuldigung, ich habe das nicht verstanden.", "Excusez-moi, je n'ai pas compris."],
  ["Gestern bin ich mit dem Velo zur Arbeit gefahren.", "Hier, je suis allé au travail à vélo."]
];
const MONO_TOPICS = [
  { thema: "Wohnen", aspekte: ["Wo?", "Wie groß?", "Mit wem?", "Was gefällt dir?"] },
  { thema: "Arbeit", aspekte: ["Was?", "Wo?", "Seit wann?", "Was machst du gern?"] },
  { thema: "Freizeit", aspekte: ["Was?", "Mit wem?", "Wann?", "Warum?"] },
  { thema: "Essen", aspekte: ["Was?", "Wo?", "Mit wem?", "Lieblingsessen?"] },
  { thema: "Reisen", aspekte: ["Wohin?", "Wann?", "Mit wem?", "Was gemacht?"] },
  { thema: "Sport", aspekte: ["Welcher Sport?", "Wie oft?", "Wo?", "Warum?"] },
  { thema: "Sprachen lernen", aspekte: ["Welche?", "Seit wann?", "Wie?", "Warum?"] },
  { thema: "Wochenende", aspekte: ["Was?", "Mit wem?", "Wo?", "Nächstes Wochenende?"] }
];
const STARTER = [
  ["die Wohnung", "die Wohnungen", "l'appartement", "Die Wohnung hat zweieinhalb Zimmer."],
  ["die Miete", "die Mieten", "le loyer", "Die Miete ist im Voraus zu bezahlen."],
  ["der Vermieter", "die Vermieter", "le bailleur", "Der Vermieter wohnt im Erdgeschoss."],
  ["die Kaution", "die Kautionen", "la caution", "Die Kaution beträgt drei Monatsmieten."],
  ["die Nebenkosten", "(pluriel)", "les charges", "Die Nebenkosten sind nicht inbegriffen."],
  ["der Arbeitsvertrag", "die Arbeitsverträge", "le contrat de travail", "Ich habe den Arbeitsvertrag unterschrieben."],
  ["die Stelle", "die Stellen", "le poste", "Die Stelle ist in Zürich."],
  ["die Bewerbung", "die Bewerbungen", "la candidature", "Ich schicke meine Bewerbung per E-Mail."],
  ["der Lebenslauf", "die Lebensläufe", "le CV", "Mein Lebenslauf ist auf Englisch."],
  ["das Vorstellungsgespräch", "die Vorstellungsgespräche", "l'entretien d'embauche", "Das Vorstellungsgespräch ist am Montag."],
  ["der Kollege", "die Kollegen", "le collègue", "Mein Kollege kommt aus Bern."],
  ["die Besprechung", "die Besprechungen", "la réunion", "Die Besprechung dauert eine Stunde."],
  ["der Termin", "die Termine", "le rendez-vous", "Ich habe morgen einen Termin."],
  ["die Gemeinde", "die Gemeinden", "la commune", "Ich melde mich bei der Gemeinde an."],
  ["die Anmeldung", "die Anmeldungen", "l'inscription, la déclaration d'arrivée", "Für die Anmeldung brauche ich meinen Pass."],
  ["die Aufenthaltsbewilligung", "die Aufenthaltsbewilligungen", "le permis de séjour (Suisse)", "Ich habe eine Aufenthaltsbewilligung B."],
  ["die Krankenkasse", "die Krankenkassen", "l'assurance maladie", "Ich muss eine Krankenkasse wählen."],
  ["der Bahnhof", "die Bahnhöfe", "la gare", "Wir treffen uns am Bahnhof."],
  ["das Gleis", "die Gleise", "la voie, le quai", "Der Zug fährt auf Gleis 7."],
  ["das Billett", "die Billette", "le billet (Suisse)", "Ich kaufe ein Billett nach Bern."],
  ["das Velo", "die Velos", "le vélo (Suisse)", "Ich fahre mit dem Velo zur Arbeit."],
  ["umziehen", "zieht um, ist umgezogen", "déménager", "Ich ziehe nächstes Jahr nach Zürich um."],
  ["sich bewerben", "bewirbt sich, hat sich beworben", "postuler", "Ich bewerbe mich als Ingenieur."],
  ["kündigen", "kündigt, hat gekündigt", "démissionner, résilier", "Ich habe meine Stelle gekündigt."],
  ["verdienen", "verdient, hat verdient", "gagner (de l'argent)", "In Zürich verdient man gut."],
  ["der Lohn", "die Löhne", "le salaire", "Der Lohn wird monatlich bezahlt."],
  ["die Steuer", "die Steuern", "l'impôt", "Die Steuern sind von Kanton zu Kanton verschieden."],
  ["das Konto", "die Konten", "le compte (bancaire)", "Ich eröffne ein Konto."],
  ["die Rechnung", "die Rechnungen", "la facture", "Die Rechnung ist schon bezahlt."],
  ["die Erfahrung", "die Erfahrungen", "l'expérience", "Ich habe vier Jahre Erfahrung."],
  ["die Daten", "(pluriel)", "les données", "Wir analysieren die Daten jeden Tag."],
  ["die Datenbank", "die Datenbanken", "la base de données", "Die Datenbank ist sehr groß."],
  ["der Bericht", "die Berichte", "le rapport", "Ich schreibe den Bericht bis Freitag."],
  ["die Aufgabe", "die Aufgaben", "la tâche", "Das ist meine wichtigste Aufgabe."],
  ["die Abteilung", "die Abteilungen", "le service, le département", "Ich arbeite in der IT-Abteilung."],
  ["das Ziel", "die Ziele", "l'objectif", "Mein Ziel ist das Zertifikat A2."],
  ["der Berglauf", "die Bergläufe", "la course en montagne", "Am Sonntag mache ich einen Berglauf."],
  ["wandern", "wandert, ist gewandert", "randonner", "Wir sind in den Alpen gewandert."],
  ["der Berg", "die Berge", "la montagne", "Von hier sieht man die Berge."],
  ["das Wetter", "", "la météo, le temps", "Wie ist das Wetter morgen?"],
  ["die Erkältung", "die Erkältungen", "le rhume", "Ich habe eine Erkältung."],
  ["der Arzt", "die Ärzte", "le médecin", "Ich gehe heute zum Arzt."],
  ["die Apotheke", "die Apotheken", "la pharmacie", "Die Apotheke ist neben dem Bahnhof."],
  ["einkaufen", "kauft ein, hat eingekauft", "faire les courses", "Ich kaufe am Samstag ein."],
  ["bezahlen", "bezahlt, hat bezahlt", "payer", "Kann ich mit Karte bezahlen?"],
  ["günstig", "", "bon marché, avantageux", "Das Menü ist hier günstig."],
  ["pünktlich", "", "ponctuel, à l'heure", "Der Zug ist pünktlich."],
  ["vereinbaren", "vereinbart, hat vereinbart", "convenir de (un rendez-vous)", "Wir vereinbaren einen Termin."],
  ["erledigen", "erledigt, hat erledigt", "régler, accomplir", "Ich erledige das sofort."],
  ["Grüezi", "", "bonjour (Suisse alémanique, vouvoiement)", "Grüezi, Frau Meier!"],
  ["das Znüni", "die Znüni", "la collation de 9 h (Suisse)", "Um neun Uhr gibt es Znüni."],
  ["parkieren", "parkiert, hat parkiert", "se garer (Suisse ; ailleurs : parken)", "Hier darf man nicht parkieren."]
];

/* ============ Utilitaires ============ */
const $ = (s, r = document) => r.querySelector(s);
function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === "class") e.className = v;
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
    else if (k === "html") e.innerHTML = v; /* contenu statique de confiance uniquement */
    else if (k === "css") e.style.cssText = v;
    else if (k === "value") e.value = v;
    else if (k === "checked") e.checked = !!v;
    else e.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat(Infinity)) {
    if (c == null || c === false) continue;
    e.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return e;
}
function fill(el, ...kids) { el.replaceChildren(...kids.flat(Infinity).filter(k => k != null && k !== false)); }
function rich(text) {
  const frag = document.createDocumentFragment();
  String(text || "").split(/\n{2,}/).forEach(par => {
    const p = h("p");
    par.split("\n").forEach((line, i) => {
      if (i) p.append(h("br"));
      line.split(/(\*\*[^*]+\*\*)/).forEach(seg => {
        if (/^\*\*[^*]+\*\*$/.test(seg)) p.append(h("strong", null, seg.slice(2, -2)));
        else if (seg) p.append(seg);
      });
    });
    frag.append(p);
  });
  return frag;
}
const pad = n => String(n).padStart(2, "0");
const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseKey = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const todayKey = () => keyOf(new Date());
const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return keyOf(d); };
const fmtDate = k => parseKey(k).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
const fmtDateLong = k => parseKey(k).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
const uid = () => "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const monthKey = () => todayKey().slice(0, 7);
function norm(s) {
  return String(s || "").toLowerCase().normalize("NFC")
    .replace(/[.,!?;:"„“”«»'’()\-–—]/g, " ").replace(/\s+/g, " ").trim();
}
const fold = s => s.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
function variants(s) { const n = norm(s); return [n, fold(n), n.replace(/ß/g, "ss")]; }
function matches(user, answers) {
  const u = new Set(variants(user));
  return (answers || []).some(a => variants(a).some(v => v && u.has(v)));
}
function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
const ICON_SPEAK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
const ICON_MIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>';
let toastTimer;
function toast(msg) {
  document.querySelectorAll(".toast").forEach(t => t.remove());
  const t = h("div", { class: "toast", role: "status" }, msg);
  document.body.append(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 3400);
}

/* ============ Stockage local ============ */
const LS = { prog: "dw:progress", cards: "dw:cards", lessons: "dw:lessons", settings: "dw:settings", key: "dw:key", timer: "dw:timer" };
function lsGet(k, def, store) { try { const v = (store || localStorage).getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } }
function lsSet(k, v, store) {
  try { (store || localStorage).setItem(k, JSON.stringify(v)); return true; }
  catch { toast("Le stockage du navigateur est plein ou bloqué. Exporte tes données dans Réglages."); return false; }
}
function lsDel(k, store) { try { (store || localStorage).removeItem(k); } catch {} }

const DEFAULT_SETTINGS = {
  fastModel: "claude-haiku-5-5", smartModel: "claude-sonnet-5-5",
  profile: "", voice: "", rate: 0.9, recoLang: "de-DE",
  autoSpeak: true, handsFree: false, remember: true, start: DEFAULT_START
};
const S = Object.assign({}, DEFAULT_SETTINGS, lsGet(LS.settings, {}));
function saveSettings() { lsSet(LS.settings, S); }
let API_KEY = (S.remember ? lsGet(LS.key, "") : lsGet(LS.key, "", sessionStorage)) || "";
function setApiKey(k, remember) {
  API_KEY = k.trim();
  S.remember = remember; saveSettings();
  lsDel(LS.key); lsDel(LS.key, sessionStorage);
  if (API_KEY) lsSet(LS.key, API_KEY, remember ? localStorage : sessionStorage);
  updateHeader();
}

function defaultProgress() { return { v: 1, level: "A1", minutes: {}, done: {}, scores: {}, exam: "", starter: false, cost: {} }; }
function normalizeProgress(p) {
  const o = Object.assign(defaultProgress(), p || {});
  for (const f of ["minutes", "done", "scores", "cost"]) if (!o[f] || typeof o[f] !== "object") o[f] = {};
  if (!["A1", "A2", "B1", "B2"].includes(o.level)) o.level = "A1";
  return o;
}
const Store = {
  progress: normalizeProgress(lsGet(LS.prog, null)),
  cards: new Map(Object.entries(lsGet(LS.cards, {}))),
  lessons: new Map(Object.entries(lsGet(LS.lessons, {}))),
  saveProgress() { lsSet(LS.prog, this.progress); },
  saveCards() { lsSet(LS.cards, Object.fromEntries(this.cards)); },
  putCard(c) { this.cards.set(c.id, c); this.saveCards(); },
  removeCard(id) { this.cards.delete(id); this.saveCards(); },
  getLesson(id) { return this.lessons.get(id) || null; },
  putLesson(id, l) { this.lessons.set(id, l); lsSet(LS.lessons, Object.fromEntries(this.lessons)); },
  exportAll() { return { app: "deutsch-werkstatt", v: 1, exported: new Date().toISOString(), progress: this.progress, cards: Object.fromEntries(this.cards), lessons: Object.fromEntries(this.lessons), settings: Object.assign({}, S) }; },
  importAll(o) {
    if (!o || o.app !== "deutsch-werkstatt") throw new Error("format");
    this.progress = normalizeProgress(o.progress);
    this.cards = new Map(Object.entries(o.cards || {}));
    this.lessons = new Map(Object.entries(o.lessons || {}));
    this.saveProgress(); this.saveCards(); lsSet(LS.lessons, Object.fromEntries(this.lessons));
    if (o.settings) { Object.assign(S, DEFAULT_SETTINGS, o.settings); saveSettings(); }
  }
};

/* Unités : dates calculées depuis la date de départ */
function scheduleUnits() {
  let k = /^\d{4}-\d{2}-\d{2}$/.test(S.start) ? S.start : DEFAULT_START;
  for (const u of UNITS) {
    if (!u.w) { u.start = null; u.end = null; continue; }
    u.start = k; k = addDays(k, u.w * 7); u.end = addDays(k, -1);
  }
}
scheduleUnits();
function currentUnit() {
  const t = todayKey();
  const dated = UNITS.filter(u => u.start);
  if (t < dated[0].start) return dated[0];
  let cur = dated[0];
  for (const u of dated) if (u.start <= t) cur = u;
  return cur;
}
const who = () => "un adulte francophone qui prépare son installation et sa vie professionnelle en Suisse alémanique" + (S.profile.trim() ? ` (ce qu'il dit de lui : ${S.profile.trim().slice(0, 300)})` : "");

/* ============ API Claude (appel direct depuis le navigateur) ============ */
const API_URL = "https://api.anthropic.com/v1/messages";
/* Prix de base en dollars par million de tokens (entrée, sortie), relevés en octobre 2026. */
const PRICES = { "claude-haiku-5-5": [0.10, 0.50], "claude-sonnet-5-5": [2, 10], "claude-opus-5-5": [4, 20], "claude-fable-5-1": [10, 50] };
function recordCost(model, usage) {
  const p = PRICES[model];
  if (!p || !usage) return;
  const usd = (usage.input || 0) * p[0] / 1e6 + (usage.output || 0) * p[1] / 1e6;
  const m = monthKey();
  Store.progress.cost[m] = Math.round(((Store.progress.cost[m] || 0) + usd) * 1e6) / 1e6;
  Store.saveProgress();
}
function parseJSON(text) {
  const t = String(text || "").trim();
  try { return JSON.parse(t); } catch {}
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) { try { return JSON.parse(fence[1]); } catch {} }
  const a = t.search(/[[{]/), b = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch {} }
  return undefined;
}
async function callClaude({ smart = false, system = "", messages, maxTokens = 2000, json = false, onText, signal }) {
  if (!API_KEY) throw { code: "nokey" };
  const model = (smart ? S.smartModel : S.fastModel).trim();
  const body = { model, max_tokens: maxTokens, stream: true, messages };
  const sys = [system, json ? "Réponds uniquement avec du JSON valide : pas de texte avant ou après, pas de bloc de code." : ""].filter(Boolean).join("\n\n");
  if (sys) body.system = sys;
  if (smart) body.output_config = { effort: "medium" };
  else {
    body.output_config = { effort: "low" };
    if (/haiku/i.test(model)) body.thinking = { type: "disabled" };
    else if (/sonnet/i.test(model)) body.thinking = { type: "between_tools" };
  }
  let res;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify(body),
      signal
    });
  } catch (e) {
    throw { code: e && e.name === "AbortError" ? "cancelled" : "network" };
  }
  if (!res.ok) {
    let msg = "";
    try { const j = await res.json(); msg = (j && j.error && j.error.message) || ""; } catch {}
    throw { code: "http", status: res.status, message: msg };
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "", text = "", stop = null;
  const usage = { input: 0, output: 0 };
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true }).replace(/\r/g, "");
      let i;
      while ((i = buf.indexOf("\n\n")) >= 0) {
        const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
        const data = chunk.split("\n").filter(l => l.startsWith("data:")).map(l => l.slice(5).trim()).join("");
        if (!data) continue;
        let ev; try { ev = JSON.parse(data); } catch { continue; }
        if (ev.type === "message_start") {
          const u = ev.message && ev.message.usage;
          if (u) { usage.input = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0); usage.output = u.output_tokens || 0; }
        } else if (ev.type === "content_block_delta" && ev.delta && ev.delta.type === "text_delta") {
          text += ev.delta.text; if (onText) onText(text);
        } else if (ev.type === "message_delta") {
          if (ev.usage && ev.usage.output_tokens != null) usage.output = ev.usage.output_tokens;
          if (ev.delta && ev.delta.stop_reason) stop = ev.delta.stop_reason;
        } else if (ev.type === "error") {
          throw { code: "stream", message: (ev.error && ev.error.message) || "", etype: ev.error && ev.error.type, text };
        }
      }
    }
  } catch (e) {
    recordCost(model, usage);
    if (e && e.name === "AbortError") throw { code: "cancelled", text };
    if (e && e.code) throw e;
    throw { code: "network", text };
  }
  recordCost(model, usage);
  if (!text.trim()) throw { code: "empty" };
  if (json) {
    const v = parseJSON(text);
    if (v === undefined) throw { code: stop === "max_tokens" ? "truncated" : "json", text };
    return v;
  }
  return { text, stop, usage };
}
function errorCopy(e) {
  if (!e) return "Erreur inconnue.";
  switch (e.code) {
    case "cancelled": return "";
    case "nokey": return "Ajoute ta clé API dans Réglages pour utiliser Claude.";
    case "network": return "Impossible de joindre l'API Claude. Vérifie ta connexion, puis réessaie.";
    case "empty": return "Réponse vide. Réessaie.";
    case "json": return "La réponse n'avait pas le bon format. Clique à nouveau pour réessayer.";
    case "truncated": return "La réponse a été coupée (trop longue). Réessaie : si ça se répète, demande moins à la fois.";
    case "bad_shape": return "La réponse était incomplète. Clique à nouveau pour réessayer.";
    case "stream": return e.etype === "overloaded_error" ? "L'API Claude est surchargée. Réessaie dans un moment." : `Erreur pendant la réponse : ${e.message || e.etype || "inconnue"}.`;
    case "http": {
      const s = e.status, m = e.message ? ` (${e.message})` : "";
      if (s === 401) return "Clé API refusée : vérifie-la dans Réglages.";
      if (s === 403) return "Cette clé n'a pas le droit d'utiliser ce modèle ou cette action." + m;
      if (s === 404) return "Modèle introuvable : vérifie les identifiants de modèle dans Réglages." + m;
      if (s === 413) return "Demande trop longue." + m;
      if (s === 429) return "Limite de débit ou de dépenses atteinte. Attends un peu, ou vérifie tes limites dans la console Claude." + m;
      if (s === 529 || s >= 500) return "L'API Claude est surchargée ou indisponible. Réessaie dans un moment.";
      return "Requête refusée par l'API" + m + ".";
    }
    default: return "Une erreur est survenue. Réessaie.";
  }
}
/* Bouton + zone d'état pendant un appel long */
async function busy(btn, slot, label, fn) {
  const ctl = new AbortController();
  const t0 = Date.now();
  let chars = 0;
  const msg = h("span", null, label);
  const stop = h("button", { class: "btn small ghost", type: "button", onclick: () => ctl.abort() }, "Arrêter");
  const box = h("div", { class: "busy" }, h("span", { class: "spinner" }), msg, stop);
  fill(slot, box);
  const iv = setInterval(() => {
    const s = Math.round((Date.now() - t0) / 1000);
    msg.textContent = chars ? `${label} · ${s} s · ${chars} caractères reçus` : `${label} · ${s} s`;
  }, 500);
  if (btn) btn.disabled = true;
  try {
    return await fn(ctl.signal, n => { chars = n; });
  } catch (e) {
    const m = errorCopy(e);
    const parts = [m];
    if (e && e.code === "nokey") parts.push(" ", h("button", { class: "btn small", type: "button", onclick: () => show("reglages") }, "Ouvrir Réglages"));
    fill(slot, m ? h("div", { class: "note err" }, ...parts) : "");
    return null;
  } finally {
    clearInterval(iv);
    if (btn) btn.disabled = false;
    if (slot.contains(box)) fill(slot);
  }
}

/* ============ Voix : synthèse ============ */
let voices = [];
function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  voices = speechSynthesis.getVoices().filter(v => /^de(-|_|$)/i.test(v.lang));
}
if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = () => { loadVoices(); if (current === "reglages") renderSettings(); };
}
function pickVoice() {
  return voices.find(x => x.voiceURI === S.voice) || voices.find(x => /de-DE/i.test(x.lang)) || voices[0] || null;
}
function speak(text, opts = {}) {
  if (!("speechSynthesis" in window)) { toast("La lecture audio n'est pas disponible dans ce navigateur."); if (opts.onend) opts.onend(); return; }
  speechSynthesis.cancel();
  const v = pickVoice();
  const parts = String(text).split(/(?<=[.!?…])\s+/).filter(s => s.trim());
  if (!parts.length) { if (opts.onend) opts.onend(); return; }
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p);
    try { if (v) u.voice = v; } catch { /* voix inutilisable : voix par défaut */ }
    u.lang = v ? v.lang : "de-DE";
    u.rate = opts.rate || S.rate || 0.9;
    if (i === parts.length - 1 && opts.onend) { u.onend = () => opts.onend(); u.onerror = () => opts.onend(); }
    speechSynthesis.speak(u);
  });
}
function stopSpeaking() { if ("speechSynthesis" in window) speechSynthesis.cancel(); }
const speakBtn = (text, title) => h("button", { class: "icon-btn", type: "button", title: title || "Écouter", "aria-label": title || "Écouter", html: ICON_SPEAK, onclick: () => speak(text) });

/* ============ Voix : reconnaissance ============ */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let activeReco = null;
function stopListening() { if (activeReco) { try { activeReco.stop(); } catch {} } }
function recoError(err) {
  const map = {
    "not-allowed": "Le micro est bloqué pour ce site : autorise-le dans les réglages du navigateur (icône à gauche de l'adresse).",
    "service-not-allowed": "La reconnaissance vocale est désactivée. Sur Safari, active la Dictée dans les réglages du système.",
    "audio-capture": "Aucun micro détecté.",
    "network": "La reconnaissance vocale a besoin d'Internet (elle passe par le service de ton navigateur).",
    "language-not-supported": "Cette langue n'est pas prise en charge par la reconnaissance vocale de ton navigateur."
  };
  if (map[err]) toast(map[err]);
}
/* Une phrase : s'arrête tout seul au silence. */
function listenOnce({ onInterim, onEnd }) {
  if (!SR) { toast("Ton navigateur ne gère pas la reconnaissance vocale : utilise Chrome, Edge ou Safari."); return null; }
  stopListening();
  const r = new SR();
  r.lang = S.recoLang || "de-DE"; r.interimResults = true; r.continuous = false; r.maxAlternatives = 1;
  let finalText = ""; const conf = [];
  r.onresult = e => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const x = e.results[i];
      if (x.isFinal) { finalText += x[0].transcript; if (x[0].confidence) conf.push(x[0].confidence); }
      else interim += x[0].transcript;
    }
    if (onInterim) onInterim((finalText + " " + interim).trim());
  };
  r.onerror = e => recoError(e.error);
  r.onend = () => { if (activeReco === r) activeReco = null; if (onEnd) onEnd(finalText.trim(), conf.length ? conf.reduce((a, b) => a + b, 0) / conf.length : 0); };
  activeReco = r;
  try { r.start(); } catch { activeReco = null; return null; }
  return r;
}
/* Long : continue jusqu'à l'arrêt manuel (monologue). */
function listenLong({ onText, onDone }) {
  if (!SR) { toast("Ton navigateur ne gère pas la reconnaissance vocale : utilise Chrome, Edge ou Safari."); return null; }
  stopListening();
  let active = true, text = "", finished = false, r;
  const finish = () => { if (finished) return; finished = true; activeReco = null; onDone(text.trim()); };
  const startOne = () => {
    r = new SR();
    r.lang = S.recoLang || "de-DE"; r.continuous = true; r.interimResults = true;
    r.onresult = e => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const x = e.results[i];
        if (x.isFinal) text += x[0].transcript.trim() + " ";
        else interim += x[0].transcript;
      }
      onText((text + interim).trim());
    };
    r.onerror = e => { if (["not-allowed", "service-not-allowed", "audio-capture"].includes(e.error)) { active = false; recoError(e.error); } };
    r.onend = () => { if (active) { try { startOne(); } catch { finish(); } } else finish(); };
    activeReco = r;
    r.start();
  };
  try { startOne(); } catch { return null; }
  return { stop() { active = false; try { r.stop(); } catch { finish(); } } };
}
/* Bouton micro qui écrit dans un champ */
function micButton(field, { label = "Parler", onDone, big = false } = {}) {
  const b = h("button", { class: "mic" + (big ? " big" : ""), type: "button", title: "Parler en allemand", html: ICON_MIC + `<span>${label}</span>` });
  if (!SR) { b.disabled = true; b.title = "Reconnaissance vocale indisponible dans ce navigateur"; return b; }
  let r = null;
  b.addEventListener("click", () => {
    if (r) { try { r.stop(); } catch {} return; }
    stopSpeaking();
    const base = field ? field.value.trim() : "";
    b.classList.add("on"); b.lastChild.textContent = "J'écoute… (clique pour finir)";
    r = listenOnce({
      onInterim: t => { if (field) field.value = (base ? base + " " : "") + t; },
      onEnd: (t, conf) => {
        r = null; b.classList.remove("on"); b.lastChild.textContent = label;
        if (field) { field.value = (base ? base + " " : "") + t; field.dataset.voice = t ? "1" : field.dataset.voice || ""; if (conf) field.dataset.conf = String(conf); field.dispatchEvent(new Event("input")); }
        if (onDone) onDone(t, conf);
      }
    });
    if (!r) { b.classList.remove("on"); b.lastChild.textContent = label; }
  });
  return b;
}

/* ============ Temps et statistiques ============ */
function addMinutes(n) {
  const k = todayKey();
  Store.progress.minutes[k] = (Store.progress.minutes[k] || 0) + n;
  Store.saveProgress();
  updateHeader();
}
const minutesOn = k => Store.progress.minutes[k] || 0;
function weekMinutes() {
  const dow = (new Date().getDay() + 6) % 7;
  let k = addDays(todayKey(), -dow), s = 0;
  for (let i = 0; i < 7; i++) { s += minutesOn(k); k = addDays(k, 1); }
  return s;
}
const totalMinutes = () => Object.values(Store.progress.minutes).reduce((a, b) => a + (Number(b) || 0), 0);
function streak() {
  let k = todayKey(), n = 0;
  for (let i = 0; i < 500; i++) {
    const day = parseKey(k).getDay();
    if (minutesOn(k) > 0) n++;
    else if (i === 0 || day === 6) { /* aujourd'hui pas encore fait, ou samedi : la série continue */ }
    else break;
    k = addDays(k, -1);
  }
  return n;
}
function dueCards() { const t = todayKey(); return [...Store.cards.values()].filter(c => (c.due || "") <= t); }
const fmtUsd = v => (v || 0).toLocaleString("fr-FR", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
function updateHeader() {
  $("#todayMin").textContent = minutesOn(todayKey());
  const lv = Store.progress.level;
  $("#lvlLabel").textContent = `${lv} → ${{ A1: "A2", A2: "B1", B1: "B2", B2: "C1" }[lv]}`;
  fill($("#keyPill"), h("span", { class: "dot " + (API_KEY ? "on" : "off") }), h("span", null, API_KEY ? "Clé API" : "Clé API manquante"));
  fill($("#micPill"), h("span", { class: "dot " + (SR ? "on" : "off") }), h("span", null, SR ? "Micro" : "Micro indisponible"));
  $("#micPill").title = SR ? "Reconnaissance vocale disponible" : "Ce navigateur ne gère pas la reconnaissance vocale (Chrome, Edge ou Safari la gèrent).";
}
const timerStart = () => Number(lsGet(LS.timer, 0)) || 0;
const setTimerStart = v => v ? lsSet(LS.timer, v) : lsDel(LS.timer);

/* ============ Navigation ============ */
const TABS = ["heute", "kurs", "gespraech", "sprechen", "schreiben", "uebungen", "wortschatz", "hoeren", "reglages"];
let current = "heute";
function show(tab) {
  if (!TABS.includes(tab)) tab = "heute";
  if (tab !== current) { stopListening(); stopSpeaking(); if (mono.rec) { mono.rec.stop(); } }
  current = tab;
  document.querySelectorAll("[data-view]").forEach(s => { s.hidden = s.dataset.view !== tab; });
  document.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
  if (location.hash.slice(1) !== tab) history.replaceState(null, "", "#" + tab);
  render(tab);
  window.scrollTo({ top: 0 });
}
document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => show(b.dataset.tab)));
$("#keyPill").addEventListener("click", () => show("reglages"));
window.addEventListener("hashchange", () => { const t = location.hash.slice(1); if (t !== current && TABS.includes(t)) show(t); });
function render(tab) {
  updateHeader();
  ({ heute: renderHeute, kurs: renderKurs, gespraech: renderChat, sprechen: renderSpeak, schreiben: renderWrite, uebungen: renderDrill, wortschatz: renderVocab, hoeren: renderListen, reglages: renderSettings })[tab]();
}
const intro = (title, text) => h("div", { class: "stack" }, h("h2", null, title), text ? h("p", { class: "muted intro" }, text) : null);
const noKeyNote = () => API_KEY ? "" : h("div", { class: "note warn" }, "Claude n'est pas encore branché : ajoute ta clé API. ", h("button", { class: "btn small", type: "button", onclick: () => show("reglages") }, "Ouvrir Réglages"));

/* ============ HEUTE ============ */
let timerIv;
function renderHeute() {
  const v = $("#v-heute");
  clearInterval(timerIv);
  const t = todayKey();
  const plan = WEEK_PLAN[new Date().getDay()];
  const u = currentUnit();
  const wk = weekMinutes(), tot = totalMinutes(), due = dueCards().length;
  const startK = UNITS[0].start;
  const before = t < startK;

  const timerOut = h("span", { class: "mono", css: "font-size:1.6rem;font-weight:600" }, "00:00");
  const startBtn = h("button", { class: "btn primary", type: "button" }, "Démarrer ma session");
  const tick = () => {
    const s0 = timerStart();
    if (!s0) { timerOut.textContent = "00:00"; startBtn.textContent = "Démarrer ma session"; return; }
    const sec = Math.floor((Date.now() - s0) / 1000);
    timerOut.textContent = `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`;
    startBtn.textContent = "Terminer et enregistrer";
  };
  startBtn.addEventListener("click", () => {
    const s0 = timerStart();
    if (!s0) { setTimerStart(Date.now()); tick(); return; }
    const m = Math.max(1, Math.round((Date.now() - s0) / 60000));
    setTimerStart(0); addMinutes(m); toast(`${m} min enregistrées.`); renderHeute();
  });
  tick(); timerIv = setInterval(tick, 1000);
  const quick = [10, 15, 30].map(n => h("button", { class: "btn small ghost", type: "button", onclick: () => { addMinutes(n); toast(`+${n} min enregistrées.`); renderHeute(); } }, `+${n} min`));

  const exam = Store.progress.exam;
  const days = exam ? Math.round((parseKey(exam) - parseKey(t)) / 86400000) : null;
  const cost = Store.progress.cost[monthKey()] || 0;

  fill(v, 
    noKeyNote(),
    h("div", { class: "grid cols-2" },
      before ? h("div", { class: "card" },
        h("div", { class: "card-head" }, h("span", { class: "label" }, fmtDateLong(t)), h("span", { class: "state next" }, `départ dans ${Math.round((parseKey(startK) - parseKey(t)) / 86400000)} jours`)),
        h("h2", null, `Ton programme démarre le ${fmtDateLong(startK)}`),
        h("p", { class: "muted" }, "D'ici là : branche ta clé API, teste le micro dans Sprechen, importe le paquet de départ dans Wortschatz, et ouvre l'unité A1.1."),
        h("div", { class: "row" }, h("button", { class: "btn primary", type: "button", onclick: () => openUnit(u.id) }, "Voir l'unité A1.1"), h("button", { class: "btn ghost", type: "button", onclick: () => show("sprechen") }, "Tester le micro"))
      ) : h("div", { class: "card" },
        h("div", { class: "card-head" }, h("span", { class: "label" }, fmtDateLong(t)), h("span", { class: "state now" }, plan.t)),
        h("h2", null, `Aujourd'hui : ${plan.t}`),
        h("p", { class: "muted" }, plan.d),
        plan.tab !== "heute" ? h("div", { class: "row" }, h("button", { class: "btn primary", type: "button", onclick: () => { if (plan.tab === "kurs") openUnit(u.id); else show(plan.tab); } }, "Y aller")) : null
      ),
      h("div", { class: "card" },
        h("div", { class: "card-head" }, h("span", { class: "label" }, "Session"), h("span", { class: "small muted" }, `${minutesOn(t)} min aujourd'hui`)),
        h("div", { class: "row", css: "justify-content:space-between" }, timerOut, startBtn),
        h("div", { class: "row" }, h("span", { class: "small muted" }, "Temps passé ailleurs (vidéos, livre) :"), quick)
      )
    ),
    h("div", { class: "grid cols-4" },
      tile("Cette semaine", wk, "/ 180 min", Math.min(1, wk / 180)),
      tile("Total", (tot / 60).toFixed(1).replace(".", ","), "/ 162 h", Math.min(1, tot / 60 / 162)),
      h("div", { class: "tile" }, h("span", { class: "label" }, "Série"), h("div", { class: "big" }, String(streak()), h("small", null, " jours")), h("span", { class: "small muted" }, "Le samedi ne casse pas la série.")),
      h("div", { class: "tile" }, h("span", { class: "label" }, "Cartes à revoir"), h("div", { class: "big" }, String(due)), h("button", { class: "btn small ghost", type: "button", onclick: () => show("wortschatz") }, due ? "Réviser" : "Ouvrir le vocabulaire")),
      h("div", { class: "tile" }, h("span", { class: "label" }, "Coût API ce mois"), h("div", { class: "big" }, fmtUsd(cost)), h("span", { class: "small muted" }, "Estimation à partir des tokens consommés."))
    ),
    h("div", { class: "card" },
      h("div", { class: "card-head" }, h("h3", null, "Ta ligne A1 → B1"), h("span", { class: "small muted" }, exam ? (days >= 0 ? `Examen dans ${days} jours` : "Examen passé") : "Date d'examen à fixer dans Réglages")),
      routeMap(u),
      h("div", { class: "row", css: "justify-content:space-between" },
        h("div", null, h("span", { class: "code-route" }, u.id), " ", h("strong", null, u.title), h("span", { class: "muted" }, ` · ${fmtDate(u.start)} → ${fmtDate(u.end)}`)),
        h("button", { class: "btn", type: "button", onclick: () => openUnit(u.id) }, "Ouvrir l'unité"))
    ),
    h("div", { class: "card" },
      h("h3", null, "Ressources gratuites en complément"),
      h("div", { class: "stack small" },
        h("p", null, h("a", { href: "https://learngerman.dw.com/en/nicos-weg/c-36519789", target: "_blank", rel: "noopener noreferrer" }, "Nicos Weg (Deutsche Welle)"), " : cours vidéo complet A1 → B1, avec un certificat par niveau."),
        h("p", null, h("a", { href: "https://www.goethe.de/ins/gb/de/m/sta/lon/prf/gzsd2/inf.html", target: "_blank", rel: "noopener noreferrer" }, "Goethe-Zertifikat A2"), " : format officiel. Lesen 30 min, Hören 30 min, Schreiben 30 min, Sprechen 15 min.")
      )
    )
  );
}
function tile(label, val, unit, frac) {
  return h("div", { class: "tile" }, h("span", { class: "label" }, label), h("div", { class: "big" }, String(val), h("small", null, " " + unit)), h("div", { class: "meter" }, h("i", { css: `width:${Math.round(frac * 100)}%` })));
}
function routeMap(cur) {
  const t = todayKey();
  const list = UNITS.filter(u => u.start);
  return h("div", { class: "route-wrap" }, h("div", { class: "route", role: "list" },
    list.map((u, i) => {
      const cls = ["stn"];
      if (Store.progress.done[u.id]) cls.push("done");
      if (u.id === cur.id) cls.push("now"); else if (u.start <= t) cls.push("past");
      if (i === 0 || list[i - 1].lvl !== u.lvl) cls.push("lvl-start");
      return h("button", { class: cls.join(" "), type: "button", role: "listitem", title: `${u.id} · ${u.title}`, onclick: () => openUnit(u.id) }, h("span", { class: "bead" }), h("span", { class: "code" }, u.id));
    })
  ));
}

/* ============ KURS ============ */
let openUnitId = null;
function openUnit(id) { openUnitId = id; show("kurs"); }
function renderKurs() {
  const v = $("#v-kurs");
  if (openUnitId) return renderUnit(v, UNITS.find(u => u.id === openUnitId));
  const cur = currentUnit();
  const groups = ["A1", "A2", "B1", "B2"].map(l => {
    const us = UNITS.filter(u => u.lvl === l);
    const span = us[0].start ? `${fmtDate(us[0].start)} → ${fmtDate(us[us.length - 1].end)}` : "";
    return h("div", { class: "stack" },
      h("div", { class: "card-head" }, h("h2", null, LEVEL_NAMES[l]), h("span", { class: "small muted mono" }, span)),
      h("div", { class: "unit-list" }, us.map(u => {
        const done = Store.progress.done[u.id];
        const st = done ? h("span", { class: "state done" }, "fait") : u.id === cur.id ? h("span", { class: "state now" }, "en cours") : u.start && u.start < todayKey() ? h("span", { class: "state next" }, "à rattraper") : h("span", { class: "state next" }, u.start ? fmtDate(u.start) : "plus tard");
        const score = Store.progress.scores[u.id];
        return h("button", { class: "unit-row", type: "button", onclick: () => { openUnitId = u.id; renderKurs(); window.scrollTo({ top: 0 }); } },
          h("span", { class: "code" }, u.id),
          h("span", null, h("span", { class: "t" }, u.title), h("span", { class: "muted" }, ` · ${u.theme}`), h("span", { class: "chips" }, u.gram.map(g => h("span", { class: "chip" }, g)))),
          h("span", { class: "stack", css: "justify-items:end" }, st, score != null ? h("span", { class: "small mono muted" }, `${score} %`) : null)
        );
      }))
    );
  });
  fill(v, intro("Le cours", "34 unités : révision A1, puis A2 (examen Goethe A2), puis B1. Chaque leçon est préparée par Claude à la première ouverture, puis gardée dans ton navigateur."), noKeyNote(), ...groups);
}
function renderUnit(v, u) {
  const back = h("button", { class: "btn ghost small", type: "button", onclick: () => { openUnitId = null; renderKurs(); } }, "← Toutes les unités");
  const slot = h("div");
  const body = h("div", { class: "lesson" });
  const done = !!Store.progress.done[u.id];
  const doneBtn = h("button", { class: "btn " + (done ? "ok" : ""), type: "button" }, done ? "Unité terminée" : "Marquer comme terminée");
  doneBtn.addEventListener("click", () => {
    if (Store.progress.done[u.id]) delete Store.progress.done[u.id]; else Store.progress.done[u.id] = todayKey();
    Store.saveProgress(); renderUnit(v, u);
  });
  fill(v, 
    h("div", { class: "row" }, back),
    h("div", { class: "card" },
      h("div", { class: "card-head" }, h("span", { class: "code-route" }, `${u.id} · ${u.lvl}`), h("span", { class: "small muted" }, u.start ? `${fmtDate(u.start)} → ${fmtDate(u.end)}` : "après l'installation")),
      h("h2", null, u.title),
      h("p", { class: "muted" }, u.theme),
      h("p", null, h("strong", null, "Objectif : "), u.can),
      h("div", { class: "chips" }, u.gram.map(g => h("span", { class: "chip" }, g))),
      h("div", { class: "row" }, doneBtn,
        h("button", { class: "btn ghost", type: "button", onclick: () => { drillPreset = { topic: u.gram.join(", "), level: u.lvl }; show("uebungen"); } }, "Plus d'exercices"),
        h("button", { class: "btn ghost", type: "button", onclick: () => { nach.list = []; nach.source = ""; nach.unit = u.id; show("sprechen"); } }, "Répéter les phrases à l'oral"))
    ),
    slot, body
  );
  const lesson = Store.getLesson(u.id);
  if (lesson) return drawLesson(body, u, lesson, slot);
  const gen = h("button", { class: "btn primary", type: "button" }, "Préparer la leçon avec Claude");
  gen.addEventListener("click", () => generateLesson(u, gen, slot, body));
  body.append(noKeyNote() || "", h("div", { class: "card" },
    h("h3", null, "Leçon pas encore préparée"),
    h("p", { class: "muted" }, "Claude rédige l'explication, les exemples, 12 mots, un dialogue et 8 exercices. Compte 30 à 90 secondes et quelques centimes. La leçon est ensuite gardée et ne coûte plus rien à rouvrir."),
    h("div", { class: "row" }, gen)
  ));
}
function lessonPrompt(u) {
  return `Tu es professeur d'allemand pour ${who()}. Prépare une leçon de niveau ${u.lvl} (CECR) pour l'unité « ${u.title} » (thème : ${u.theme}). Points de grammaire : ${u.gram.join(" ; ")}.

Règles : allemand standard (Hochdeutsch) parfaitement correct ; explications en français, claires et brèves ; situations de la vie en Suisse ou au travail ; vocabulaire adapté au niveau ${u.lvl}.

Réponds avec un objet JSON de cette forme :
{"objectifs":["…"],"explication":"en français, 120 à 220 mots, **gras** autorisé, paragraphes séparés par une ligne vide","tableau":{"titre":"…","entetes":["…"],"lignes":[["…"]]},"exemples":[{"de":"…","fr":"…"}],"vocabulaire":[{"de":"nom avec article, ou verbe à l'infinitif","forms":"pluriel du nom, ou 3e personne et Perfekt du verbe, ou chaîne vide","fr":"…","ex":"phrase exemple courte en allemand"}],"dialogue":[{"qui":"A","de":"…","fr":"…"}],"exercices":[…]}

Contraintes : 3 objectifs ; 6 exemples ; 12 mots ; un dialogue de 6 à 8 répliques entre A et B ; 8 exercices variés. Écris les nombres en toutes lettres dans les exemples et le dialogue.
Chaque exercice : {"type":"trou"|"qcm"|"ordre"|"transformation","consigne":"en français","question":"en allemand ; pour trou, marque le blanc avec ___","options":["…"] (qcm uniquement, 3 ou 4 options),"mots":["…"] (ordre uniquement : tous les mots de la phrase, dans le désordre, sans ponctuation),"reponses":["toutes les réponses correctes acceptées"],"explication":"une phrase en français"}.
Pour trou, la réponse contient seulement le ou les mots manquants. Pour ordre, la réponse est la phrase complète sans point final. Pour qcm, la réponse est le texte exact de la bonne option.`;
}
function validExercises(list) {
  return (Array.isArray(list) ? list : []).filter(x => x && typeof x.question === "string" && Array.isArray(x.reponses) && x.reponses.length && ["trou", "qcm", "ordre", "transformation"].includes(x.type))
    .map(x => {
      if (x.type === "qcm" && !(Array.isArray(x.options) && x.options.length >= 2)) x.type = "trou";
      if (x.type === "ordre" && !(Array.isArray(x.mots) && x.mots.length >= 2)) x.type = "transformation";
      return x;
    });
}
async function generateLesson(u, btn, slot, body) {
  const res = await busy(btn, slot, "Claude prépare ta leçon", (signal, onChars) =>
    callClaude({ smart: true, json: true, maxTokens: 16000, messages: [{ role: "user", content: lessonPrompt(u) }], signal, onText: t => onChars(t.length) }));
  if (!res) return;
  if (!res.explication || !Array.isArray(res.exemples)) { fill(slot, h("div", { class: "note err" }, errorCopy({ code: "bad_shape" }))); return; }
  res.exercices = validExercises(res.exercices);
  res.genere = todayKey();
  Store.putLesson(u.id, res);
  drawLesson(body, u, res, slot);
}
function drawLesson(body, u, L, slot) {
  const parts = [];
  if (Array.isArray(L.objectifs) && L.objectifs.length) parts.push(h("div", { class: "card" }, h("span", { class: "label" }, "Dans cette leçon"), h("ul", { class: "list" }, L.objectifs.map(o => h("li", null, String(o))))));
  parts.push(h("div", { class: "card" }, h("h3", null, "Grammaire"), h("div", { class: "prose" }, rich(L.explication)),
    L.tableau && Array.isArray(L.tableau.lignes) ? h("div", { class: "stack" }, L.tableau.titre ? h("span", { class: "label" }, String(L.tableau.titre)) : null,
      h("div", { class: "tbl-wrap" }, h("table", { class: "tbl" },
        Array.isArray(L.tableau.entetes) ? h("thead", null, h("tr", null, L.tableau.entetes.map(x => h("th", null, String(x))))) : null,
        h("tbody", null, L.tableau.lignes.map(r => h("tr", null, (Array.isArray(r) ? r : [r]).map(c => h("td", null, String(c))))))))) : null));
  if (Array.isArray(L.exemples)) parts.push(h("div", { class: "card" }, h("h3", null, "Exemples"),
    h("div", null, L.exemples.map(e => h("div", { class: "ex-line" }, speakBtn(e.de), h("div", null, h("div", { class: "de" }, String(e.de || "")), h("div", { class: "fr" }, String(e.fr || ""))))))));
  if (Array.isArray(L.vocabulaire) && L.vocabulaire.length) {
    const addAll = h("button", { class: "btn small", type: "button" }, "Ajouter les mots à mes cartes");
    addAll.addEventListener("click", () => { const n = addCards(L.vocabulaire.map(w => ({ de: w.de, forms: w.forms, fr: w.fr, ex: w.ex }))); toast(n ? `${n} cartes ajoutées.` : "Ces mots sont déjà dans tes cartes."); });
    parts.push(h("div", { class: "card" }, h("div", { class: "card-head" }, h("h3", null, "Vocabulaire"), addAll),
      h("div", { class: "tbl-wrap" }, h("table", { class: "tbl" }, h("thead", null, h("tr", null, h("th", null, ""), h("th", null, "Allemand"), h("th", null, "Formes"), h("th", null, "Français"))),
        h("tbody", null, L.vocabulaire.map(w => h("tr", null, h("td", null, speakBtn(w.de)), h("td", { class: "de" }, String(w.de || "")), h("td", { class: "mono small" }, String(w.forms || "")), h("td", null, String(w.fr || "")))))))));
  }
  if (Array.isArray(L.dialogue) && L.dialogue.length) {
    const all = L.dialogue.map(d => d.de).join(" ");
    parts.push(h("div", { class: "card" }, h("div", { class: "card-head" }, h("h3", null, "Dialogue"), h("button", { class: "btn small ghost", type: "button", onclick: () => speak(all) }, "Écouter tout")),
      h("div", null, L.dialogue.map(d => h("div", { class: "ex-line" }, h("span", { class: "code-route" }, String(d.qui || "")), h("div", null, h("div", { class: "de" }, String(d.de || "")), h("div", { class: "fr" }, String(d.fr || ""))))))));
  }
  if (Array.isArray(L.exercices) && L.exercices.length) {
    const box = h("div");
    parts.push(h("div", { class: "card" }, h("h3", null, "Exercices"), box));
    exercises(box, L.exercices, pct => { Store.progress.scores[u.id] = pct; Store.saveProgress(); });
  }
  const regen = h("button", { class: "btn small ghost", type: "button" }, "Refaire la leçon");
  regen.addEventListener("click", () => generateLesson(u, regen, slot, body));
  parts.push(h("div", { class: "row" }, h("span", { class: "small muted" }, L.genere ? `Leçon préparée le ${fmtDate(L.genere)}.` : ""), regen));
  fill(body, ...parts);
}

/* ============ Exercices interactifs ============ */
function exercises(container, items, onDone) {
  const getters = [];
  const blocks = items.map((x, i) => {
    let input, get;
    if (x.type === "qcm") {
      const name = "q" + Math.random().toString(36).slice(2);
      input = h("div", { class: "opts" }, x.options.map(o => h("label", null, h("input", { type: "radio", name, value: String(o) }), String(o))));
      get = () => { const c = input.querySelector("input:checked"); return c ? c.value : ""; };
    } else if (x.type === "ordre") {
      const built = h("div", { class: "built", "aria-live": "polite" });
      const chosen = [];
      const wordsBox = h("div", { class: "words" });
      const draw = () => { built.textContent = chosen.map(c => c.w).join(" ") || "Clique sur les mots dans l'ordre"; built.classList.toggle("muted", !chosen.length); };
      shuffle(x.mots).forEach(w => {
        const b = h("button", { class: "word", type: "button" }, String(w));
        b.addEventListener("click", () => { if (b.classList.contains("used")) return; b.classList.add("used"); chosen.push({ w: String(w), b }); draw(); });
        wordsBox.append(b);
      });
      const reset = h("button", { class: "btn small ghost", type: "button", onclick: () => { chosen.forEach(c => c.b.classList.remove("used")); chosen.length = 0; draw(); } }, "Recommencer");
      draw();
      input = h("div", { class: "stack" }, wordsBox, built, h("div", null, reset));
      get = () => chosen.map(c => c.w).join(" ");
    } else {
      input = h("input", { type: "text", autocomplete: "off", spellcheck: "false", "aria-label": "Ta réponse", class: x.type === "transformation" ? "wide" : "" });
      get = () => input.value;
    }
    const fb = h("div", { class: "fb", hidden: true });
    const block = h("div", { class: "ex" }, h("span", { class: "n" }, `${i + 1} / ${items.length}`), x.consigne ? h("div", { class: "small muted" }, String(x.consigne)) : null, h("div", { class: "q" }, String(x.question)), input, fb);
    getters.push({ get, block, fb, x });
    return block;
  });
  const result = h("div");
  const check = h("button", { class: "btn primary", type: "button" }, "Vérifier mes réponses");
  check.addEventListener("click", () => {
    let ok = 0;
    for (const g of getters) {
      const ans = g.get();
      const good = ans.trim() !== "" && matches(ans, g.x.reponses);
      if (good) ok++;
      g.block.classList.toggle("ok", good); g.block.classList.toggle("ko", !good);
      g.fb.hidden = false;
      fill(g.fb, 
        h("div", null, h("strong", null, good ? "Juste. " : "Pas tout à fait. "), good ? "" : h("span", null, "Réponse attendue : ", h("strong", null, String(g.x.reponses[0])))),
        g.x.explication ? h("div", { class: "muted" }, String(g.x.explication)) : null
      );
    }
    const pct = Math.round(ok / getters.length * 100);
    fill(result, h("div", { class: "note " + (pct >= 70 ? "ok" : "") }, h("strong", null, `${ok} / ${getters.length} (${pct} %)`), pct >= 70 ? " · Bien joué." : " · Relis l'explication, puis refais les exercices ratés."));
    if (onDone) onDone(pct);
  });
  fill(container, h("div", { class: "ex-list" }, blocks), h("div", { class: "row", css: "margin-top:10px" }, check), result);
}

/* ============ GESPRÄCH (conversation, voix) ============ */
const chat = { scen: SCENARIOS[0], turns: [], view: [] };
function chatRules() {
  const lv = Store.progress.level;
  return `Tu es un partenaire de conversation en allemand pour ${who()}, de niveau ${lv} (CECR, ${LEVEL_INFO[lv]}).
Situation : ${chat.scen.p}
Règles :
1. Reste dans ton rôle. Réponds uniquement en allemand standard, en 1 à 3 phrases courtes adaptées au niveau ${lv}, et termine par une question pour relancer. Pas d'emoji, pas de mise en forme : ta réponse est lue à voix haute.
2. Ensuite, sur une nouvelle ligne, écris exactement ### puis corrige le DERNIER message de l'apprenant : s'il est correct, écris seulement OK ; sinon, écris la version corrigée en allemand, puis une ou deux explications très courtes en français.
3. Pour ton tout premier message (il n'y a pas encore de message de l'apprenant), écris ### suivi de rien.
4. Un message qui commence par [oral] vient de la reconnaissance vocale. Ne corrige ni la ponctuation ni les majuscules. Si un mot semble mal reconnu (un mot réel mais incongru à cet endroit), signale-le comme un probable problème de prononciation et donne le mot attendu.`;
}
function splitReply(text) {
  const i = text.indexOf("###");
  if (i < 0) return { reply: text.trim(), corr: "" };
  return { reply: text.slice(0, i).trim(), corr: text.slice(i + 3).trim() };
}
function renderChat() {
  const v = $("#v-gespraech");
  const log = h("div", { class: "chat", "aria-live": "polite" });
  const slot = h("div");
  const ta = h("textarea", { id: "chatInput", placeholder: "Parle avec le micro ou écris en allemand… (Entrée pour envoyer)" });
  ta.addEventListener("input", () => { if (!ta.value.trim()) { delete ta.dataset.voice; delete ta.dataset.conf; } });
  const send = h("button", { class: "btn primary", type: "button" }, "Envoyer");
  const startBtn = h("button", { class: "btn", type: "button" }, chat.view.length ? "Nouvelle conversation" : "Commencer");
  const autoSpeak = h("input", { type: "checkbox", id: "optSpeak", checked: S.autoSpeak });
  const handsFree = h("input", { type: "checkbox", id: "optHands", checked: S.handsFree, disabled: !SR });
  autoSpeak.addEventListener("change", () => { S.autoSpeak = autoSpeak.checked; saveSettings(); if (!S.autoSpeak) stopSpeaking(); });
  handsFree.addEventListener("change", () => { S.handsFree = handsFree.checked; saveSettings(); if (S.handsFree) { S.autoSpeak = true; autoSpeak.checked = true; saveSettings(); } else stopListening(); });

  function draw() {
    fill(log, ...(chat.view.length ? chat.view.map(m => m.who === "me"
      ? h("div", { class: "msg me" }, m.voice ? h("span", { class: "voice-tag" }, "à l'oral") : null, h("div", null, m.text), m.corr != null ? h("div", { class: "corr " + (/^ok\b/i.test(m.corr) || !m.corr ? "good" : "") }, m.corr && !/^ok\b/i.test(m.corr) ? m.corr : "Parfait, rien à corriger.") : null)
      : h("div", { class: "msg bot" }, h("div", { class: "meta" }, speakBtn(m.text), h("span", { class: "label" }, chat.scen.t)), h("div", null, m.text || "…"))) :
      [h("div", { class: "note" }, "Choisis une situation, puis clique sur « Commencer ». Claude joue le rôle, te parle à voix haute et corrige chacun de tes messages. Avec « Mains libres », tu n'as plus besoin de cliquer : le micro s'ouvre quand Claude a fini de parler.")]));
  }
  function listenForReply() {
    if (!SR || current !== "gespraech") return;
    const r = listenOnce({
      onInterim: t => { ta.value = t; },
      onEnd: (t, conf) => {
        micBtn.classList.remove("on");
        if (!t) { toast("Je n'ai rien entendu. Clique sur Parler pour réessayer."); return; }
        if (S.handsFree) { ta.value = ""; call(t, { voice: true, conf }); }
        else { ta.value = t; ta.dataset.voice = "1"; if (conf) ta.dataset.conf = String(conf); }
      }
    });
    if (r) micBtn.classList.add("on");
  }
  async function call(userText, meta = {}) {
    if (userText) {
      const tag = meta.voice ? `[oral${meta.conf ? `, confiance ${meta.conf.toFixed(2)}` : ""}] ` : "";
      chat.turns.push({ role: "user", content: tag + userText });
      chat.view.push({ who: "me", text: userText, corr: null, voice: !!meta.voice });
    }
    const bot = { who: "bot", text: "" };
    chat.view.push(bot); draw();
    const lastMe = [...chat.view].reverse().find(m => m.who === "me");
    const messages = chat.turns.length ? chat.turns.slice(-16) : [{ role: "user", content: "Commence la conversation." }];
    if (messages[0].role !== "user") messages.unshift({ role: "user", content: "(suite de la conversation)" });
    const res = await busy(send, slot, "Claude répond", signal =>
      callClaude({ system: chatRules(), messages, maxTokens: 700, signal, onText: t => { const s = splitReply(t); bot.text = s.reply; if (lastMe && userText) lastMe.corr = s.corr || null; draw(); } }));
    if (!res) {
      chat.view.pop();
      if (userText) { chat.turns.pop(); chat.view.pop(); ta.value = userText; }
      draw(); return;
    }
    const s = splitReply(res.text);
    bot.text = s.reply;
    if (lastMe && userText) lastMe.corr = s.corr || "OK";
    chat.turns.push({ role: "assistant", content: res.text.trim() });
    draw();
    log.lastElementChild?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    if (S.autoSpeak && s.reply) speak(s.reply, { onend: () => { if (S.handsFree) listenForReply(); } });
    else if (S.handsFree) listenForReply();
  }
  const micBtn = micButton(ta, { label: "Parler" });
  send.addEventListener("click", () => {
    const t = ta.value.trim();
    if (!t) return;
    if (!chat.view.length) { toast("Clique d'abord sur « Commencer »."); return; }
    const meta = { voice: ta.dataset.voice === "1", conf: Number(ta.dataset.conf) || 0 };
    ta.value = ""; delete ta.dataset.voice; delete ta.dataset.conf;
    call(t, meta);
  });
  ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send.click(); } });
  startBtn.addEventListener("click", () => { stopSpeaking(); stopListening(); chat.turns = []; chat.view = []; draw(); startBtn.textContent = "Nouvelle conversation"; call(null); });

  const scen = h("div", { class: "scen" }, SCENARIOS.map(s => h("button", { type: "button", "aria-pressed": String(s.id === chat.scen.id), onclick: () => { stopSpeaking(); stopListening(); chat.scen = s; chat.turns = []; chat.view = []; renderChat(); } }, s.t, h("span", null, s.d))));
  fill(v, 
    intro("Gespräch", `Niveau ${Store.progress.level}. Claude reste dans son rôle, te répond à voix haute et te corrige à chaque message. À l'oral, un mot mal reconnu trahit souvent un souci de prononciation : Claude te le signale.`),
    noKeyNote(),
    h("div", { class: "chat-layout" },
      h("div", { class: "stack" }, h("span", { class: "label" }, "Situation"), scen),
      h("div", { class: "card" },
        h("div", { class: "card-head" }, h("h3", null, chat.scen.t), startBtn),
        h("div", { class: "row" }, h("label", { class: "check" }, autoSpeak, "Lire les réponses à voix haute"), h("label", { class: "check" }, handsFree, "Mains libres")),
        log, slot,
        h("div", { class: "composer" }, ta, h("div", { class: "btns" }, micBtn, send)))
    )
  );
  draw();
}

/* ============ SPRECHEN (oral) ============ */
const nach = { list: [], i: 0, hide: false, source: "", unit: null, last: null };
const mono = { topic: MONO_TOPICS[0], rec: null, text: "", t0: 0, dur: 0, result: null };
let speakMode = "nach";
function lessonSentences(unitId) {
  const L = Store.getLesson(unitId);
  if (!L) return [];
  const a = (L.exemples || []).map(e => [e.de, e.fr]);
  const b = (L.dialogue || []).map(d => [d.de, d.fr]);
  return [...a, ...b].filter(x => x[0] && String(x[0]).split(" ").length >= 3);
}
function compareWords(target, said) {
  const T = norm(target).split(" ").filter(Boolean), Y = norm(said).split(" ").filter(Boolean);
  const tf = T.map(fold), yf = Y.map(fold);
  const n = T.length, m = Y.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = tf[i] === yf[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const hit = new Array(n).fill(false);
  let i = 0, j = 0;
  while (i < n && j < m) { if (tf[i] === yf[j]) { hit[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
  const words = String(target).split(/\s+/).filter(w => norm(w));
  return { words, hit, score: n ? Math.round(hit.filter(Boolean).length / n * 100) : 0 };
}
function renderSpeak() {
  const v = $("#v-sprechen");
  const seg = h("div", { class: "seg", role: "group", "aria-label": "Mode" },
    h("button", { type: "button", "aria-pressed": String(speakMode === "nach"), onclick: () => { if (mono.rec) mono.rec.stop(); speakMode = "nach"; renderSpeak(); } }, "Nachsprechen"),
    h("button", { type: "button", "aria-pressed": String(speakMode === "mono"), onclick: () => { speakMode = "mono"; renderSpeak(); } }, "Monologue type examen"));
  const head = [
    intro("Sprechen", "Nachsprechen : écoute une phrase, répète-la, et vois quels mots ont été reconnus. Monologue : parle une à deux minutes sur un thème, comme à l'examen, puis fais-toi évaluer."),
    SR ? null : h("div", { class: "note err" }, "Ton navigateur ne gère pas la reconnaissance vocale. Ouvre le site dans Chrome, Edge ou Safari."),
    h("div", { class: "row" }, seg)
  ];
  if (speakMode === "nach") fill(v, ...head, ...renderNach());
  else fill(v, ...head, ...renderMono());
}
function renderNach() {
  const u = UNITS.find(x => x.id === nach.unit) || currentUnit();
  if (!nach.list.length) {
    const fromLesson = lessonSentences(u.id);
    if (fromLesson.length) { nach.list = fromLesson; nach.source = `phrases de l'unité ${u.id}`; }
    else { nach.list = NACH_BASE.slice(); nach.source = "phrases de base"; }
    nach.i = 0; nach.last = null;
  }
  const slot = h("div");
  const gen = h("button", { class: "btn ghost small", type: "button" }, "8 nouvelles phrases avec Claude");
  gen.addEventListener("click", async () => {
    const lv = Store.progress.level;
    const res = await busy(gen, slot, "Claude choisit des phrases", signal => callClaude({ json: true, maxTokens: 1500, signal, messages: [{ role: "user", content:
      `Donne 8 phrases allemandes de niveau ${lv} à répéter à voix haute, sur le thème « ${u.theme} », utiles à ${who()}. Phrases naturelles de 6 à 14 mots, allemand standard, nombres écrits en toutes lettres, avec quelques sons difficiles pour un francophone (ü, ö, ch, r, z, h aspiré, mots composés).
Réponds avec un objet JSON : {"phrases":[{"de":"…","fr":"…"}]}` }] }));
    if (!res) return;
    const list = (Array.isArray(res.phrases) ? res.phrases : []).filter(p => p && p.de).map(p => [String(p.de), String(p.fr || "")]);
    if (!list.length) { fill(slot, h("div", { class: "note err" }, errorCopy({ code: "bad_shape" }))); return; }
    nach.list = list; nach.i = 0; nach.last = null; nach.source = "phrases générées"; renderSpeak();
  });
  const [de, fr] = nach.list[nach.i % nach.list.length];
  const result = h("div");
  const drawResult = () => {
    if (!nach.last) { fill(result); return; }
    const c = nach.last;
    fill(result, h("div", { class: "stack" },
      h("div", { class: "score" }, h("b", null, `${c.score} %`), h("span", { class: "muted" }, "des mots reconnus")),
      h("div", { class: "words-diff" }, c.words.map((w, i) => [h("span", { class: c.hit[i] ? "hit" : "miss" }, w), " "])),
      h("div", { class: "small muted" }, "Entendu : ", h("span", { class: "de" }, c.said || "(rien)")),
      c.score < 100 ? h("p", { class: "small" }, "Les mots soulignés n'ont pas été reconnus. Écoute-les lentement, puis réessaie.") : h("p", { class: "small" }, "Parfait.")));
  };
  const mic = micButton(null, { label: "Répéter", big: true, onDone: said => { nach.last = Object.assign(compareWords(de, said), { said }); drawResult(); } });
  const hideBox = h("input", { type: "checkbox", id: "optHide", checked: nach.hide });
  hideBox.addEventListener("change", () => { nach.hide = hideBox.checked; renderSpeak(); });
  const go = d => { nach.i = (nach.i + d + nach.list.length) % nach.list.length; nach.last = null; renderSpeak(); };
  drawResult();
  return [
    h("div", { class: "card" },
      h("div", { class: "card-head" }, h("span", { class: "label" }, `Phrase ${nach.i % nach.list.length + 1} / ${nach.list.length} · ${nach.source}`), h("label", { class: "check" }, hideBox, "Cacher le texte")),
      h("div", { class: "say" + (nach.hide ? " hidden-text" : "") }, nach.hide ? "• • • • • •" : de),
      !nach.hide && fr ? h("p", { class: "fr" }, fr) : null,
      h("div", { class: "row" },
        h("button", { class: "btn", type: "button", onclick: () => speak(de) }, "Écouter"),
        h("button", { class: "btn ghost", type: "button", onclick: () => speak(de, { rate: Math.max(0.55, (S.rate || 0.9) - 0.3) }) }, "Lentement"),
        mic),
      result,
      h("div", { class: "row", css: "justify-content:space-between" },
        h("button", { class: "btn ghost small", type: "button", onclick: () => go(-1) }, "← Précédente"),
        h("button", { class: "btn small", type: "button", onclick: () => go(1) }, "Suivante →"))
    ),
    h("div", { class: "card" },
      h("div", { class: "row" },
        Store.getLesson(u.id) ? h("button", { class: "btn ghost small", type: "button", onclick: () => { nach.list = lessonSentences(u.id); nach.source = `phrases de l'unité ${u.id}`; nach.i = 0; nach.last = null; renderSpeak(); } }, `Phrases de l'unité ${u.id}`) : null,
        h("button", { class: "btn ghost small", type: "button", onclick: () => { nach.list = NACH_BASE.slice(); nach.source = "phrases de base"; nach.i = 0; nach.last = null; renderSpeak(); } }, "Phrases de base"),
        gen),
      slot,
      h("p", { class: "small muted" }, "La reconnaissance vocale juge si un mot est compréhensible, pas l'accent. Un mot raté plusieurs fois mérite d'être travaillé lentement.")
    )
  ];
}
function renderMono() {
  const T = mono.topic;
  const live = h("div", { class: "live", "aria-live": "polite" }, mono.text || "Ta transcription apparaîtra ici.");
  const slot = h("div");
  const res = h("div");
  const timer = h("span", { class: "mono" }, "0:00");
  let iv;
  const rec = h("button", { class: "mic big", type: "button", html: ICON_MIC + "<span>Commencer à parler</span>", disabled: !SR });
  const setRecUi = on => { rec.classList.toggle("on", on); rec.lastChild.textContent = on ? "Terminer" : (mono.text ? "Recommencer" : "Commencer à parler"); };
  rec.addEventListener("click", () => {
    if (mono.rec) { mono.rec.stop(); return; }
    stopSpeaking();
    mono.text = ""; mono.result = null; fill(res); live.textContent = "…";
    mono.t0 = Date.now();
    mono.rec = listenLong({
      onText: t => { mono.text = t; live.textContent = t || "…"; },
      onDone: t => {
        mono.rec = null; clearInterval(iv); mono.text = t; mono.dur = Math.round((Date.now() - mono.t0) / 1000);
        setRecUi(false); live.textContent = t || "(rien n'a été reconnu)"; drawStats();
      }
    });
    if (!mono.rec) return;
    setRecUi(true);
    iv = setInterval(() => { const s = Math.round((Date.now() - mono.t0) / 1000); timer.textContent = `${Math.floor(s / 60)}:${pad(s % 60)}`; }, 500);
  });
  const evalBtn = h("button", { class: "btn primary", type: "button" }, "Faire évaluer");
  const stats = h("div", { class: "small muted" });
  const drawStats = () => {
    const n = (mono.text.match(/\S+/g) || []).length;
    const wpm = mono.dur ? Math.round(n / (mono.dur / 60)) : 0;
    stats.textContent = mono.text ? `${n} mots en ${Math.floor(mono.dur / 60)} min ${pad(mono.dur % 60)} s · environ ${wpm} mots par minute` : "";
    evalBtn.disabled = n < 8;
  };
  evalBtn.addEventListener("click", async () => {
    const lv = Store.progress.level;
    const n = (mono.text.match(/\S+/g) || []).length;
    const out = await busy(evalBtn, slot, "Claude évalue ton monologue", (signal, onChars) => callClaude({ smart: true, json: true, maxTokens: 8000, signal, onText: t => onChars(t.length), messages: [{ role: "user", content:
      `Tu es examinateur de l'épreuve orale Goethe-Zertifikat ${lv}. Le candidat, ${who()}, devait parler de lui sur le thème « ${T.thema} » en s'appuyant sur ces mots-clés : ${T.aspekte.join(", ")}.
Voici la transcription automatique de sa parole (reconnaissance vocale : pas de ponctuation fiable ; un mot réel mais incongru peut signaler un problème de prononciation). Durée : ${mono.dur} s, ${n} mots.
"""${mono.text.slice(0, 5000)}"""

Réponds avec un objet JSON : {"note":nombre de 0 à 10,"criteres":[{"nom":"Réalisation de la tâche","points":n,"max":4,"commentaire":"…"},{"nom":"Aisance","points":n,"max":2,"commentaire":"d'après la durée et le débit"},{"nom":"Vocabulaire","points":n,"max":2,"commentaire":"…"},{"nom":"Grammaire","points":n,"max":2,"commentaire":"…"}],"version_corrigee":"le texte corrigé, ponctué, en gardant au maximum ses mots","erreurs":[{"original":"…","correction":"…","explication":"en français, une phrase"}],"prononciation":["mots probablement mal prononcés, d'après la transcription, avec le mot attendu"],"phrases_modeles":["3 phrases de niveau ${lv} qu'il aurait pu dire sur ce thème"],"conseil":"un conseil concret en français"}. Au plus 8 erreurs. Commentaires en français.` }] }));
    if (!out) return;
    if (typeof out.note !== "number" || !Array.isArray(out.criteres)) { fill(slot, h("div", { class: "note err" }, errorCopy({ code: "bad_shape" }))); return; }
    mono.result = out; drawEval();
  });
  const drawEval = () => {
    const R = mono.result;
    if (!R) return;
    fill(res, h("div", { class: "grid" },
      h("div", { class: "row", css: "justify-content:space-between" }, h("div", { class: "score" }, h("b", null, String(R.note).replace(".", ",")), h("span", { class: "muted" }, "/ 10 · indicatif")), h("div", { class: "meter signal", css: "flex:1;max-width:260px" }, h("i", { css: `width:${Math.max(0, Math.min(100, R.note * 10))}%` }))),
      h("div", { class: "crit" }, R.criteres.map(c => [h("div", null, h("strong", null, String(c.nom)), h("div", { class: "small muted" }, String(c.commentaire || ""))), h("div", { class: "mono" }, `${c.points}/${c.max}`)])),
      R.version_corrigee ? h("div", { class: "stack" }, h("div", { class: "card-head" }, h("span", { class: "label" }, "Version corrigée"), speakBtn(R.version_corrigee)), h("div", { class: "note pre" }, String(R.version_corrigee))) : null,
      Array.isArray(R.erreurs) && R.erreurs.length ? h("div", { class: "tbl-wrap" }, h("table", { class: "tbl diff" }, h("tbody", null, R.erreurs.map(e => h("tr", null, h("td", null, h("del", null, String(e.original || ""))), h("td", null, h("ins", null, String(e.correction || ""))), h("td", { class: "small muted" }, String(e.explication || ""))))))) : null,
      Array.isArray(R.prononciation) && R.prononciation.length ? h("div", { class: "note warn" }, h("strong", null, "Prononciation : "), R.prononciation.map(String).join(" · ")) : null,
      Array.isArray(R.phrases_modeles) && R.phrases_modeles.length ? h("div", { class: "stack" }, h("span", { class: "label" }, "Phrases modèles"), R.phrases_modeles.map(p => h("div", { class: "ex-line" }, speakBtn(String(p)), h("div", { class: "de" }, String(p))))) : null,
      R.conseil ? h("div", { class: "note ok" }, h("strong", null, "Conseil : "), String(R.conseil)) : null
    ));
  };
  drawStats(); drawEval(); setRecUi(false);
  return [
    h("div", { class: "card" },
      h("div", { class: "card-head" }, h("span", { class: "label" }, "Erzählen Sie über sich · Goethe A2, Sprechen Teil 2"), h("button", { class: "btn small ghost", type: "button", onclick: () => { mono.topic = MONO_TOPICS[(MONO_TOPICS.indexOf(T) + 1) % MONO_TOPICS.length]; mono.text = ""; mono.result = null; renderSpeak(); } }, "Autre thème")),
      h("div", { class: "topic" }, T.thema),
      h("div", { class: "aspects" }, T.aspekte.map(a => h("div", { class: "aspect" }, a))),
      h("p", { class: "small muted" }, "Parle une à deux minutes en couvrant les quatre mots-clés. Clique sur Terminer quand tu as fini."),
      h("div", { class: "row", css: "justify-content:space-between" }, rec, timer),
      live, stats,
      h("div", { class: "row" }, evalBtn), slot, res
    )
  ];
}

/* ============ SCHREIBEN ============ */
const writing = { task: null, result: null, text: "" };
function renderWrite() {
  const v = $("#v-schreiben");
  const lv = Store.progress.level;
  const [mn, mx] = WRITE_LEN[lv];
  const slot = h("div");
  const newBtn = h("button", { class: writing.task ? "btn ghost" : "btn primary", type: "button" }, writing.task ? "Autre sujet" : "Me donner un sujet");
  newBtn.addEventListener("click", async () => {
    const res = await busy(newBtn, slot, "Claude prépare un sujet", signal => callClaude({ json: true, maxTokens: 1200, signal, messages: [{ role: "user", content:
      `Crée un sujet de rédaction de type Goethe-Zertifikat ${lv} pour ${who()}. Longueur attendue : ${mn} à ${mx} mots. Varie les situations (message à un collègue, à un voisin, à une régie, à un ami, réponse à une invitation, demande d'information…).
Réponds avec un objet JSON : {"type":"SMS, E-Mail ou message de forum","situation_de":"la consigne en allemand, au niveau ${lv}","situation_fr":"la même consigne en français","points":["point 1 à traiter","point 2","point 3"]}. Les points sont en allemand.` }] }));
    if (!res) return;
    if (!res.situation_de || !Array.isArray(res.points)) { fill(slot, h("div", { class: "note err" }, errorCopy({ code: "bad_shape" }))); return; }
    writing.task = res; writing.result = null; writing.text = ""; renderWrite();
  });
  const parts = [intro("Schreiben", `Niveau ${lv} : ${mn} à ${mx} mots. Claude corrige avec un barème inspiré des critères Goethe (réalisation de la tâche, cohérence, vocabulaire, grammaire). La note est indicative.`), noKeyNote(), h("div", { class: "row" }, newBtn), slot];
  if (writing.task) {
    const T = writing.task;
    const ta = h("textarea", { id: "writeInput", placeholder: "Schreib hier deinen Text…" });
    ta.value = writing.text;
    const count = h("span", { class: "mono small" });
    const words = () => (ta.value.trim().match(/\S+/g) || []).length;
    const upd = () => { const n = words(); count.textContent = `${n} mots`; count.style.color = n < mn || n > mx + 15 ? "var(--warn)" : "var(--ok)"; writing.text = ta.value; };
    ta.addEventListener("input", upd); upd();
    const evalSlot = h("div");
    const evalBtn = h("button", { class: "btn primary", type: "button" }, "Faire corriger");
    evalBtn.addEventListener("click", async () => {
      if (words() < 5) { toast("Écris d'abord ton texte."); return; }
      const res = await busy(evalBtn, evalSlot, "Claude corrige ton texte", (signal, onChars) => callClaude({ smart: true, json: true, maxTokens: 8000, signal, onText: t => onChars(t.length), messages: [{ role: "user", content:
        `Tu es examinateur Goethe-Zertifikat ${lv}. Corrige la production écrite de ${who()}.
Sujet (${T.type}) : ${T.situation_de}
Points à traiter : ${T.points.join(" | ")}
Longueur attendue : ${mn} à ${mx} mots.
Texte de l'apprenant :
"""${ta.value.slice(0, 4000)}"""

Réponds avec un objet JSON : {"note":nombre de 0 à 10,"criteres":[{"nom":"Réalisation de la tâche","points":n,"max":4,"commentaire":"…"},{"nom":"Cohérence","points":n,"max":2,"commentaire":"…"},{"nom":"Vocabulaire","points":n,"max":2,"commentaire":"…"},{"nom":"Grammaire","points":n,"max":2,"commentaire":"…"}],"texte_corrige":"le texte entièrement corrigé, en gardant au maximum les mots de l'apprenant","erreurs":[{"original":"…","correction":"…","explication":"en français, une phrase"}],"a_retenir":[{"de":"mot ou expression utile, avec article pour les noms","fr":"…"}],"conseil":"un conseil concret en français pour le prochain texte"}. Au plus 8 erreurs, les plus importantes d'abord ; 3 à 5 éléments à retenir. Commentaires en français.` }] }));
      if (!res) return;
      if (typeof res.note !== "number" || !Array.isArray(res.criteres)) { fill(evalSlot, h("div", { class: "note err" }, errorCopy({ code: "bad_shape" }))); return; }
      writing.result = res; drawWriteResult(evalSlot);
    });
    parts.push(h("div", { class: "card" },
      h("div", { class: "card-head" }, h("span", { class: "label" }, String(T.type || "Texte")), speakBtn(T.situation_de, "Écouter la consigne")),
      h("p", { class: "de" }, String(T.situation_de)),
      h("p", { class: "fr" }, String(T.situation_fr || "")),
      h("ul", { class: "list" }, T.points.map(p => h("li", null, String(p)))),
      ta,
      h("div", { class: "row", css: "justify-content:space-between" }, count, evalBtn),
      evalSlot));
    if (writing.result) drawWriteResult(evalSlot);
  } else parts.push(h("div", { class: "note" }, "Clique sur « Me donner un sujet ». Écris sans dictionnaire, comme le jour de l'examen, puis fais corriger."));
  fill(v, ...parts);
}
function drawWriteResult(slot) {
  const R = writing.result;
  const keep = h("button", { class: "btn small", type: "button" }, "Ajouter à mes cartes");
  keep.addEventListener("click", () => { const n = addCards((R.a_retenir || []).map(w => ({ de: w.de, fr: w.fr }))); toast(n ? `${n} cartes ajoutées.` : "Déjà dans tes cartes."); });
  fill(slot, h("div", { class: "grid" },
    h("div", { class: "row", css: "justify-content:space-between" },
      h("div", { class: "score" }, h("b", null, String(R.note).replace(".", ",")), h("span", { class: "muted" }, "/ 10 · indicatif")),
      h("div", { class: "meter signal", css: "flex:1;max-width:260px" }, h("i", { css: `width:${Math.max(0, Math.min(100, R.note * 10))}%` }))),
    h("div", { class: "crit" }, R.criteres.map(c => [h("div", null, h("strong", null, String(c.nom)), h("div", { class: "small muted" }, String(c.commentaire || ""))), h("div", { class: "mono" }, `${c.points}/${c.max}`)])),
    R.texte_corrige ? h("div", { class: "stack" }, h("div", { class: "card-head" }, h("span", { class: "label" }, "Version corrigée"), speakBtn(R.texte_corrige)), h("div", { class: "note pre" }, String(R.texte_corrige))) : null,
    Array.isArray(R.erreurs) && R.erreurs.length ? h("div", { class: "stack" }, h("span", { class: "label" }, "Erreurs principales"),
      h("div", { class: "tbl-wrap" }, h("table", { class: "tbl diff" }, h("tbody", null, R.erreurs.map(e => h("tr", null, h("td", null, h("del", null, String(e.original || ""))), h("td", null, h("ins", null, String(e.correction || ""))), h("td", { class: "small muted" }, String(e.explication || "")))))))) : null,
    Array.isArray(R.a_retenir) && R.a_retenir.length ? h("div", { class: "stack" }, h("div", { class: "card-head" }, h("span", { class: "label" }, "À retenir"), keep), h("div", { class: "chips" }, R.a_retenir.map(w => h("span", { class: "chip" }, `${w.de} · ${w.fr}`)))) : null,
    R.conseil ? h("div", { class: "note ok" }, h("strong", null, "Conseil : "), String(R.conseil)) : null
  ));
}

/* ============ ÜBUNGEN ============ */
let drillPreset = null;
const drill = { items: null, topic: "" };
function renderDrill() {
  const v = $("#v-uebungen");
  const lv = drillPreset ? drillPreset.level : Store.progress.level;
  const topics = [...new Set(UNITS.filter(u => u.lvl === lv).flatMap(u => u.gram))];
  const sel = h("select", { id: "drillTopic" }, h("option", { value: "" }, "Choisis un point de grammaire…"), topics.map(t => h("option", { value: t }, t)));
  const custom = h("input", { type: "text", id: "drillCustom", placeholder: "…ou écris ton sujet (ex. : Dativ nach mit)", class: "flex1" });
  if (drillPreset) { custom.value = drillPreset.topic; drillPreset = null; }
  const n = h("select", { id: "drillN" }, [8, 12].map(x => h("option", { value: x }, `${x} exercices`)));
  const slot = h("div");
  const box = h("div");
  const go = h("button", { class: "btn primary", type: "button" }, "Générer");
  go.addEventListener("click", async () => {
    const topic = custom.value.trim() || sel.value;
    if (!topic) { toast("Choisis un point de grammaire."); return; }
    const res = await busy(go, slot, "Claude prépare les exercices", (signal, onChars) => callClaude({ smart: true, json: true, maxTokens: 8000, signal, onText: t => onChars(t.length), messages: [{ role: "user", content:
      `Crée ${n.value} exercices d'allemand de niveau ${lv} (CECR) sur : « ${topic} », pour ${who()}. Allemand standard parfaitement correct. Mélange les types.
Réponds avec un objet JSON : {"exercices":[{"type":"trou"|"qcm"|"ordre"|"transformation","consigne":"en français","question":"en allemand ; pour trou, marque le blanc avec ___","options":["…"] (qcm uniquement),"mots":["…"] (ordre uniquement : tous les mots de la phrase dans le désordre, sans ponctuation),"reponses":["toutes les réponses correctes acceptées"],"explication":"une phrase en français"}]}
Pour trou, la réponse contient seulement le ou les mots manquants. Pour ordre, la réponse est la phrase complète sans point final. Pour qcm, la réponse est le texte exact de la bonne option.` }] }));
    if (!res) return;
    const items = validExercises(res.exercices);
    if (!items.length) { fill(slot, h("div", { class: "note err" }, errorCopy({ code: "bad_shape" }))); return; }
    drill.items = items; drill.topic = topic;
    fill(box, h("p", { class: "label" }, topic));
    const inner = h("div"); box.append(inner); exercises(inner, items);
  });
  fill(v, 
    intro("Übungen", `Exercices générés à la demande, niveau ${lv}. La correction est immédiate et les variantes d'orthographe (ae pour ä, ss pour ß) sont acceptées.`),
    noKeyNote(),
    h("div", { class: "card" }, h("div", { class: "row" }, sel, custom, n, go), slot),
    box
  );
  if (drill.items) { box.append(h("p", { class: "label" }, drill.topic)); const inner = h("div"); box.append(inner); exercises(inner, drill.items); }
}

/* ============ WORTSCHATZ ============ */
const INTERVALS = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 };
function addCards(list) {
  const have = new Set([...Store.cards.values()].map(c => norm(c.de)));
  let n = 0;
  const t = todayKey();
  for (const w of list) {
    if (!w || !w.de || !w.fr || have.has(norm(w.de))) continue;
    const c = { id: uid(), de: String(w.de).slice(0, 120), forms: String(w.forms || "").slice(0, 120), fr: String(w.fr).slice(0, 160), ex: String(w.ex || "").slice(0, 240), box: 1, due: addDays(t, Math.floor(n / 12)), added: t };
    Store.cards.set(c.id, c); have.add(norm(c.de)); n++;
  }
  if (n) Store.saveCards();
  return n;
}
const review = { queue: null, i: 0, flipped: false, dir: "de", stats: { ok: 0, ko: 0 }, t0: 0, keys: null, said: null };
function renderVocab() {
  const v = $("#v-wortschatz");
  if (review.queue) return renderReview(v);
  const cards = [...Store.cards.values()];
  const due = dueCards();
  const counts = [1, 2, 3, 4, 5].map(b => cards.filter(c => (c.box || 1) === b).length);
  const slot = h("div");
  const theme = h("input", { type: "text", id: "vocabTheme", placeholder: "Thème (ex. : Bureau, Wohnung, Zug…)", class: "flex1" });
  const gen = h("button", { class: "btn", type: "button" }, "Générer 15 mots");
  gen.addEventListener("click", async () => {
    const th = theme.value.trim() || currentUnit().theme;
    const lv = Store.progress.level;
    const res = await busy(gen, slot, "Claude choisit les mots", signal => callClaude({ json: true, maxTokens: 2500, signal, messages: [{ role: "user", content:
      `Donne 15 mots ou expressions allemands utiles de niveau ${lv} sur le thème « ${th} », pour ${who()}. Allemand standard ; ajoute un helvétisme seulement s'il est très courant, en le signalant « (Suisse) » dans la traduction.
Réponds avec un objet JSON : {"mots":[{"de":"nom avec article, ou verbe à l'infinitif","forms":"pluriel, ou 3e personne et Perfekt, ou chaîne vide","fr":"traduction","ex":"phrase exemple courte en allemand"}]}` }] }));
    if (!res) return;
    const nAdd = addCards(Array.isArray(res.mots) ? res.mots : []);
    toast(nAdd ? `${nAdd} cartes ajoutées.` : "Aucun mot nouveau.");
    renderVocab();
  });
  const fDe = h("input", { type: "text", id: "addDe", placeholder: "Allemand (avec article)" });
  const fFr = h("input", { type: "text", id: "addFr", placeholder: "Français" });
  const add = h("button", { class: "btn ghost", type: "button" }, "Ajouter");
  add.addEventListener("click", () => { if (!fDe.value.trim() || !fFr.value.trim()) return; const n = addCards([{ de: fDe.value.trim(), fr: fFr.value.trim() }]); toast(n ? "Carte ajoutée." : "Déjà dans tes cartes."); renderVocab(); });
  const search = h("input", { type: "search", id: "vocabSearch", placeholder: "Chercher dans mes cartes…", class: "w100" });
  const list = h("div", { class: "vocab-list" });
  const drawList = () => {
    const q = norm(search.value);
    const shown = cards.filter(c => !q || norm(c.de + " " + c.fr).includes(q)).sort((a, b) => a.de.localeCompare(b.de, "de"));
    fill(list, ...(shown.length ? shown.slice(0, 400).map(c => h("div", { class: "vocab-item" },
      h("div", null, h("span", { class: "de" }, c.de), c.forms ? h("span", { class: "mono small muted" }, `  ${c.forms}`) : null, h("div", { class: "fr" }, c.fr)),
      h("div", { class: "row" }, h("span", { class: "mono small muted", title: "Boîte" }, `B${c.box || 1}`), speakBtn(c.de),
        h("button", { class: "btn small ghost", type: "button", "aria-label": `Supprimer ${c.de}`, onclick: () => { Store.removeCard(c.id); renderVocab(); } }, "Suppr.")))) :
      [h("p", { class: "muted small" }, cards.length ? "Aucun résultat." : "Aucune carte pour l'instant.")]));
  };
  search.addEventListener("input", drawList); drawList();
  const starter = !Store.progress.starter ? h("div", { class: "note" }, h("strong", null, "Paquet de départ : "), "52 mots utiles pour la Suisse (logement, travail, démarches, train, helvétismes). Ils arrivent par paquets de 12 par jour. ",
    h("button", { class: "btn small", type: "button", onclick: () => { const n = addCards(STARTER.map(([de, forms, fr, ex]) => ({ de, forms, fr, ex }))); Store.progress.starter = true; Store.saveProgress(); toast(`${n} cartes importées.`); renderVocab(); } }, "Importer")) : null;
  fill(v, 
    intro("Wortschatz", "Révision espacée en 5 boîtes : une carte sue monte d'une boîte et revient plus tard (1, 2, 4, 8 puis 16 jours), une carte ratée retourne dans la boîte 1. Dans le sens français → allemand, tu peux répondre au micro."),
    h("div", { class: "grid cols-2" },
      h("div", { class: "card" },
        h("div", { class: "card-head" }, h("h3", null, `${due.length} carte${due.length > 1 ? "s" : ""} à revoir`), h("span", { class: "small muted" }, `${cards.length} au total`)),
        h("div", { class: "boxes" }, counts.map((c, i) => h("div", { class: "box" }, h("b", null, String(c)), h("span", null, `boîte ${i + 1}`)))),
        h("div", { class: "row" },
          h("button", { class: "btn primary", type: "button", disabled: !due.length, onclick: () => startReview("de") }, "Allemand → français"),
          h("button", { class: "btn", type: "button", disabled: !due.length, onclick: () => startReview("fr") }, "Français → allemand"))
      ),
      h("div", { class: "card" }, h("h3", null, "Ajouter des mots"), h("div", { class: "row" }, theme, gen), slot, h("div", { class: "row" }, fDe, fFr, add))
    ),
    starter,
    h("div", { class: "card" }, h("h3", null, "Mes cartes"), search, list)
  );
}
function startReview(dir) {
  review.queue = shuffle(dueCards()).slice(0, 30);
  review.i = 0; review.flipped = false; review.dir = dir; review.stats = { ok: 0, ko: 0 }; review.t0 = Date.now(); review.said = null;
  renderVocab();
}
function renderReview(v) {
  const q = review.queue;
  if (review.i >= q.length) {
    const mins = Math.max(1, Math.round((Date.now() - review.t0) / 60000));
    review.queue = null; review.keys = null;
    fill(v, h("div", { class: "card" }, h("h2", null, "Révision terminée"), h("p", null, `${review.stats.ok} sues, ${review.stats.ko} à revoir · environ ${mins} min.`),
      h("div", { class: "row" }, h("button", { class: "btn primary", type: "button", onclick: () => { addMinutes(mins); toast(`${mins} min enregistrées.`); renderVocab(); } }, `Enregistrer ${mins} min`), h("button", { class: "btn ghost", type: "button", onclick: () => renderVocab() }, "Retour"))));
    return;
  }
  const c = Store.cards.get(q[review.i].id) || q[review.i];
  const front = review.dir === "de" ? c.de : c.fr;
  const back = review.dir === "de" ? c.fr : c.de;
  const grade = g => {
    let box = c.box || 1;
    if (g === "ko") { box = 1; review.stats.ko++; q.push(c); }
    else if (g === "ok") { box = Math.min(5, box + 1); review.stats.ok++; }
    else review.stats.ok++;
    Store.putCard(Object.assign({}, c, { box, due: addDays(todayKey(), INTERVALS[box]) }));
    review.i++; review.flipped = false; review.said = null; renderReview(v);
  };
  const oral = review.dir === "fr" && SR && !review.flipped ? micButton(null, { label: "Répondre à l'oral", onDone: said => { review.said = said; review.flipped = true; renderReview(v); } }) : null;
  let saidNote = null;
  if (review.said != null) {
    const target = c.de.replace(/^(der|die|das|sich)\s+/i, "");
    const ok = norm(review.said).includes(norm(target)) || fold(norm(review.said)).includes(fold(norm(target)));
    saidNote = h("div", { class: "note " + (ok ? "ok" : "err") }, `Entendu : « ${review.said || "rien"} » · `, ok ? "reconnu" : "pas reconnu");
  }
  const flash = h("div", { class: "flash" },
    h("span", { class: "label" }, `${review.i + 1} / ${q.length} · boîte ${c.box || 1}`),
    h("div", { class: "front" }, front),
    review.dir === "de" ? speakBtn(c.de) : null,
    review.flipped ? h("div", { class: "back" }, h("div", { class: "de", css: "font-size:1.2rem" }, back), c.forms ? h("div", { class: "mono small muted" }, c.forms) : null, c.ex ? h("div", { class: "fr" }, c.ex) : null, review.dir === "fr" ? h("div", null, speakBtn(c.de)) : null) : null,
    saidNote
  );
  fill(v, 
    h("div", { class: "row", css: "justify-content:space-between" }, h("button", { class: "btn ghost small", type: "button", onclick: () => { review.i = q.length; renderReview(v); } }, "Arrêter la révision"), h("span", { class: "small muted" }, "Espace : retourner · 1 raté · 2 difficile · 3 su")),
    flash,
    review.flipped ? h("div", { class: "grade" },
      h("button", { class: "btn bad", type: "button", onclick: () => grade("ko") }, "Raté"),
      h("button", { class: "btn", type: "button", onclick: () => grade("mid") }, "Difficile"),
      h("button", { class: "btn ok", type: "button", onclick: () => grade("ok") }, "Su")) :
      h("div", { class: "grade one" }, h("div", { class: "row", css: "justify-content:center" }, h("button", { class: "btn primary", type: "button", onclick: () => { review.flipped = true; renderReview(v); } }, "Afficher la réponse"), oral))
  );
  review.keys = e => {
    if (current !== "wortschatz" || !review.queue || /input|textarea|select/i.test((document.activeElement && document.activeElement.tagName) || "")) return;
    if (e.key === " ") { e.preventDefault(); if (!review.flipped) { review.flipped = true; renderReview(v); } }
    else if (review.flipped && ["1", "2", "3"].includes(e.key)) grade({ "1": "ko", "2": "mid", "3": "ok" }[e.key]);
  };
}
document.addEventListener("keydown", e => { if (review.keys) review.keys(e); });

/* ============ HÖREN & LESEN ============ */
const listen = { mode: "hoeren", data: null, reveal: false };
function renderListen() {
  const v = $("#v-hoeren");
  const lv = Store.progress.level;
  const slot = h("div");
  const theme = h("select", { id: "listenTheme" }, h("option", { value: "" }, "Thème au hasard"), HOEREN_THEMES.map(t => h("option", { value: t }, t)));
  const go = h("button", { class: "btn primary", type: "button" }, "Nouveau texte");
  go.addEventListener("click", async () => {
    const th = theme.value || HOEREN_THEMES[Math.floor(Math.random() * HOEREN_THEMES.length)];
    const res = await busy(go, slot, "Claude écrit le texte", signal => callClaude({ json: true, maxTokens: 3000, signal, messages: [{ role: "user", content:
      `Écris un texte allemand de niveau ${lv} (CECR), de ${READ_LEN[lv]} mots, sur le thème « ${th} », situé en Suisse alémanique. Style naturel, allemand standard, nombres écrits en toutes lettres. Puis 4 questions de compréhension à choix multiple (3 options chacune), en allemand.
Réponds avec un objet JSON : {"titre":"…","texte":"…","questions":[{"question":"…","options":["…","…","…"],"reponse":index de la bonne option (0, 1 ou 2),"explication":"en français, une phrase"}],"vocabulaire":[{"de":"…","fr":"…"}]} avec 5 mots de vocabulaire du texte.` }] }));
    if (!res) return;
    if (!res.texte || !Array.isArray(res.questions)) { fill(slot, h("div", { class: "note err" }, errorCopy({ code: "bad_shape" }))); return; }
    listen.data = res; listen.reveal = false; renderListen();
  });
  const modeBtns = h("div", { class: "seg", role: "group", "aria-label": "Mode" }, ["hoeren", "lesen"].map(m => h("button", { type: "button", "aria-pressed": String(listen.mode === m), onclick: () => { listen.mode = m; renderListen(); } }, m === "hoeren" ? "Hören (écoute)" : "Lesen (lecture)")));
  const parts = [
    intro("Hören & Lesen", `Niveau ${lv}. En mode écoute, le texte reste caché jusqu'à ce que tu aies répondu, comme à l'examen.`),
    noKeyNote(),
    h("div", { class: "card" }, h("div", { class: "row" }, modeBtns, theme, go), slot)
  ];
  const D = listen.data;
  if (D) {
    const hidden = listen.mode === "hoeren" && !listen.reveal;
    const qBox = h("div");
    const textBox = h("div", { class: "note pre", css: "line-height:1.7", hidden }, String(D.texte));
    const showBtn = h("button", { class: "btn small ghost", type: "button", hidden: !hidden }, "Afficher le texte");
    const reveal = () => { listen.reveal = true; textBox.hidden = false; showBtn.hidden = true; };
    showBtn.addEventListener("click", reveal);
    const items = D.questions.filter(q => Array.isArray(q.options)).map(q => ({ type: "qcm", question: q.question, options: q.options, reponses: [String(q.options[Number(q.reponse)] ?? q.options[0])], explication: q.explication }));
    exercises(qBox, items, reveal);
    parts.push(h("div", { class: "card" },
      h("div", { class: "card-head" }, h("h3", null, String(D.titre || "Text")), h("div", { class: "row" },
        h("button", { class: "btn", type: "button", onclick: () => speak(D.texte) }, "Écouter"),
        h("button", { class: "btn ghost small", type: "button", onclick: () => speak(D.texte, { rate: Math.max(0.6, (S.rate || 0.9) - 0.2) }) }, "Plus lent"),
        h("button", { class: "btn ghost small", type: "button", onclick: stopSpeaking }, "Stop"), showBtn)),
      textBox,
      h("span", { class: "label" }, "Questions"), qBox,
      Array.isArray(D.vocabulaire) && D.vocabulaire.length ? h("div", { class: "row" }, h("div", { class: "chips" }, D.vocabulaire.map(w => h("span", { class: "chip" }, `${w.de} · ${w.fr}`))),
        h("button", { class: "btn small", type: "button", onclick: () => { const n = addCards(D.vocabulaire); toast(n ? `${n} cartes ajoutées.` : "Déjà dans tes cartes."); } }, "Ajouter à mes cartes")) : null
    ));
  } else parts.push(h("div", { class: "note" }, "Clique sur « Nouveau texte ». La voix dépend de ton appareil : choisis-la dans Réglages."));
  fill(v, ...parts);
}

/* ============ RÉGLAGES ============ */
let confirmReset = false;
function renderSettings() {
  const v = $("#v-reglages");
  const p = Store.progress;
  const slot = h("div");

  const key = h("input", { type: "password", id: "apiKey", autocomplete: "off", spellcheck: "false", placeholder: "sk-ant-…", class: "w100" });
  key.value = API_KEY;
  const remember = h("input", { type: "checkbox", id: "remember", checked: S.remember });
  const saveKey = h("button", { class: "btn primary", type: "button" }, "Enregistrer");
  saveKey.addEventListener("click", () => { setApiKey(key.value, remember.checked); toast(API_KEY ? "Clé enregistrée." : "Clé supprimée."); renderSettings(); });
  const testKey = h("button", { class: "btn", type: "button", disabled: !API_KEY }, "Tester");
  testKey.addEventListener("click", async () => {
    const r = await busy(testKey, slot, "Test de la clé", signal => callClaude({ maxTokens: 30, signal, messages: [{ role: "user", content: "Antworte nur mit: Alles klar!" }] }));
    if (r) fill(slot, h("div", { class: "note ok" }, `Ça marche. Réponse de ${S.fastModel} : « ${r.text.trim()} »`));
  });
  const delKey = h("button", { class: "btn ghost", type: "button", disabled: !API_KEY }, "Supprimer la clé");
  delKey.addEventListener("click", () => { setApiKey("", remember.checked); toast("Clé supprimée de ce navigateur."); renderSettings(); });

  const fast = h("input", { type: "text", id: "fastModel", value: S.fastModel, spellcheck: "false" });
  const smart = h("input", { type: "text", id: "smartModel", value: S.smartModel, spellcheck: "false" });
  const saveModels = h("button", { class: "btn small", type: "button" }, "Enregistrer les modèles");
  saveModels.addEventListener("click", () => { S.fastModel = fast.value.trim() || DEFAULT_SETTINGS.fastModel; S.smartModel = smart.value.trim() || DEFAULT_SETTINGS.smartModel; saveSettings(); toast("Modèles enregistrés."); renderSettings(); });
  const resetModels = h("button", { class: "btn small ghost", type: "button" }, "Valeurs par défaut");
  resetModels.addEventListener("click", () => { S.fastModel = DEFAULT_SETTINGS.fastModel; S.smartModel = DEFAULT_SETTINGS.smartModel; saveSettings(); renderSettings(); });

  const profile = h("textarea", { id: "profile", placeholder: "Facultatif. Ex. : je travaille dans la tech, j'aime la montagne et la course à pied, je vise Zurich.", css: "min-height:80px" });
  profile.value = S.profile;
  profile.addEventListener("change", () => { S.profile = profile.value.slice(0, 400); saveSettings(); toast("Profil enregistré."); });

  const lvl = h("select", { id: "setLevel" }, ["A1", "A2", "B1", "B2"].map(l => h("option", { value: l, selected: p.level === l }, `${l} · ${LEVEL_INFO[l]}`)));
  lvl.addEventListener("change", () => { p.level = lvl.value; Store.saveProgress(); updateHeader(); toast("Niveau mis à jour."); });
  const exam = h("input", { type: "date", id: "setExam", value: p.exam || "" });
  exam.addEventListener("change", () => { p.exam = exam.value; Store.saveProgress(); });
  const start = h("input", { type: "date", id: "setStart", value: S.start });
  start.addEventListener("change", () => { if (start.value) { S.start = start.value; saveSettings(); scheduleUnits(); toast("Calendrier recalculé."); } });

  const voice = h("select", { id: "setVoice" }, h("option", { value: "" }, voices.length ? "Automatique" : "Aucune voix allemande trouvée"),
    voices.map(x => h("option", { value: x.voiceURI, selected: S.voice === x.voiceURI }, `${x.name} · ${x.lang}`)));
  voice.addEventListener("change", () => { S.voice = voice.value; saveSettings(); speak("Grüezi! Wie geht es dir?"); });
  const rate = h("select", { id: "setRate" }, [0.7, 0.8, 0.9, 1, 1.1].map(r => h("option", { value: r, selected: Math.abs(S.rate - r) < 0.01 }, `${String(r).replace(".", ",")}×`)));
  rate.addEventListener("change", () => { S.rate = Number(rate.value); saveSettings(); });
  const reco = h("select", { id: "setReco" }, [["de-DE", "Allemand (Allemagne)"], ["de-CH", "Allemand (Suisse)"], ["de-AT", "Allemand (Autriche)"]].map(([c, l]) => h("option", { value: c, selected: S.recoLang === c }, l)));
  reco.addEventListener("change", () => { S.recoLang = reco.value; saveSettings(); });
  const testMic = micButton(null, { label: "Tester le micro", onDone: t => toast(t ? `Entendu : « ${t} »` : "Je n'ai rien entendu.") });

  const exp = h("button", { class: "btn", type: "button" }, "Exporter mes données");
  exp.addEventListener("click", () => {
    const data = Store.exportAll(); delete data.settings.key;
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: "application/json" }));
    const a = h("a", { href: url, download: `deutsch-werkstatt-${todayKey()}.json` });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
  const file = h("input", { type: "file", id: "importFile", accept: "application/json,.json", hidden: true });
  file.addEventListener("change", async () => {
    const f = file.files && file.files[0]; if (!f) return;
    try { Store.importAll(JSON.parse(await f.text())); scheduleUnits(); toast("Données importées."); renderSettings(); updateHeader(); }
    catch { toast("Ce fichier n'est pas une sauvegarde de Deutsch-Werkstatt."); }
    file.value = "";
  });
  const imp = h("button", { class: "btn ghost", type: "button", onclick: () => file.click() }, "Importer une sauvegarde");
  const reset = h("button", { class: "btn bad", type: "button" }, confirmReset ? "Confirmer : tout effacer" : "Tout effacer");
  reset.addEventListener("click", () => {
    if (!confirmReset) { confirmReset = true; renderSettings(); return; }
    Object.values(LS).forEach(k => { lsDel(k); lsDel(k, sessionStorage); });
    location.reload();
  });

  const costs = Object.entries(p.cost).sort().reverse().slice(0, 6);
  fill(v, 
    intro("Réglages", "Tout reste dans ce navigateur : ta clé, ta progression, tes leçons et tes cartes. Les seuls appels réseau partent vers l'API Claude et vers le service de reconnaissance vocale de ton navigateur."),
    h("div", { class: "card" },
      h("h3", null, "Clé API Claude"),
      h("p", { class: "small muted" }, "Crée une clé dans la console Claude (platform.claude.com), idéalement une clé dédiée à ce site avec une limite de dépenses. Elle n'est envoyée qu'à api.anthropic.com."),
      key,
      h("label", { class: "check" }, remember, "Mémoriser sur cet appareil (sinon, oubliée à la fermeture de l'onglet)"),
      h("div", { class: "row" }, saveKey, testKey, delKey),
      slot,
      h("p", { class: "small muted" }, "Ne l'utilise pas sur un ordinateur partagé. Si tu penses qu'elle a fuité, révoque-la dans la console et crées-en une autre.")
    ),
    h("div", { class: "grid cols-2" },
      h("div", { class: "card" },
        h("h3", null, "Voix et micro"),
        h("label", { class: "field" }, h("span", { class: "label" }, "Voix de lecture"), voice),
        h("label", { class: "field" }, h("span", { class: "label" }, "Vitesse"), rate),
        h("label", { class: "field" }, h("span", { class: "label" }, "Langue du micro"), reco),
        h("div", { class: "row" }, testMic),
        h("p", { class: "small muted" }, SR ? "Sur Mac, les voix « améliorées » (Réglages Système → Accessibilité → Contenu énoncé) sonnent bien mieux. Choisis Allemagne pour le micro si tu prépares le Goethe : la Suisse écrit ss au lieu de ß." : "Ce navigateur ne gère pas la reconnaissance vocale. Utilise Chrome, Edge ou Safari pour parler.")
      ),
      h("div", { class: "card" },
        h("h3", null, "Programme"),
        h("label", { class: "field" }, h("span", { class: "label" }, "Mon niveau actuel"), lvl),
        h("label", { class: "field" }, h("span", { class: "label" }, "Date de départ du programme"), start),
        h("label", { class: "field" }, h("span", { class: "label" }, "Date de l'examen"), exam),
        h("label", { class: "field" }, h("span", { class: "label" }, "Ce que Claude doit savoir de toi"), profile)
      )
    ),
    h("div", { class: "grid cols-2" },
      h("div", { class: "card" },
        h("h3", null, "Modèles"),
        h("label", { class: "field" }, h("span", { class: "label" }, "Rapide : conversation, sujets, mots, textes"), fast),
        h("label", { class: "field" }, h("span", { class: "label" }, "Soigné : leçons, exercices, corrections"), smart),
        h("div", { class: "row" }, saveModels, resetModels),
        h("p", { class: "small muted" }, "Par défaut : Claude Haiku 5.5 (0,10 $ / 0,50 $ par million de tokens en entrée / sortie) et Claude Sonnet 5.5 (2 $ / 10 $). Si un modèle est retiré, remplace son identifiant ici.")
      ),
      h("div", { class: "card" },
        h("h3", null, "Coûts estimés"),
        costs.length ? h("div", { class: "crit" }, costs.map(([m, c]) => [h("div", null, m), h("div", { class: "mono" }, fmtUsd(c))])) : h("p", { class: "small muted" }, "Aucun appel pour l'instant."),
        h("p", { class: "small muted" }, "Calculé à partir des tokens renvoyés par l'API et des prix de base d'octobre 2026. La facture réelle est dans la console Claude.")
      )
    ),
    h("div", { class: "card" },
      h("h3", null, "Sauvegarde"),
      h("p", { class: "small muted" }, "Pour passer d'un appareil à l'autre, exporte ici et importe là-bas. La clé API n'est jamais exportée."),
      h("div", { class: "row" }, exp, imp, file, reset)
    )
  );
}

/* ============ Démarrage ============ */
const startTab = (location.hash || "").slice(1);
current = TABS.includes(startTab) ? startTab : "heute";
document.querySelectorAll("[data-view]").forEach(s => { s.hidden = s.dataset.view !== current; });
document.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === current)));
render(current);
