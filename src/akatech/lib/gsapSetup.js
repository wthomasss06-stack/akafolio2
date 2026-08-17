'use client'

// Point d'enregistrement unique des plugins GSAP utilisés par AKATECH.
// Importé (pour son effet de bord : l'appel à registerPlugin) par tout
// fichier qui a besoin de ScrollTrigger. L'enregistrement est
// idempotent côté GSAP, mais le centraliser ici évite de le dupliquer
// dans chaque composant et garantit qu'il tourne avant toute création
// de ScrollTrigger, quel que soit l'ordre d'import des modules (grâce
// au cache des modules ES : ce fichier ne s'exécute réellement qu'une
// seule fois, peu importe le nombre de fois où il est importé).
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(ScrollTrigger, Draggable)

export { gsap, ScrollTrigger, Draggable }
