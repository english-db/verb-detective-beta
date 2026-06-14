# Fix : Pulsation des hotspots au démarrage de Stage 2

## Contexte

Au début de Stage 2, un **blue chip** affiche en français le verbe à identifier.
Une minorité d'utilisateurs ne comprend pas qu'il faut **cliquer sur le hotspot correspondant dans l'image** (et non sur le chip).

**Solution retenue :** faire pulser tous les checkmarks verts (`.hotspot-icon`) dès l'entrée en Stage 2, en boucle, avec un léger décalage de phase entre eux (effet vague). La pulsation s'arrête après le **premier clic réussi** dans ce stage.

---

## Fichier 1 : `css/style.css`

### Ajouter à la fin du fichier

```css
/* ============================================
   STAGE 2 — HOTSPOT PULSE ANIMATION
   ============================================ */

@keyframes hotspotPulse {
  0%   { transform: translate(-50%, -50%) scale(1);    box-shadow: 0 0 0px 0px rgba(46, 204, 113, 0.0); }
  50%  { transform: translate(-50%, -50%) scale(1.32); box-shadow: 0 0 14px 6px rgba(46, 204, 113, 0.7); }
  100% { transform: translate(-50%, -50%) scale(1);    box-shadow: 0 0 0px 0px rgba(46, 204, 113, 0.0); }
}

.hotspot-icon.pulsing {
  animation: hotspotPulse 1.4s ease-in-out infinite;
}
```

> **Note :** Le `transform` doit répliquer le `translate(-50%, -50%)` déjà appliqué par le style de base du `.hotspot-icon`, sinon la pulsation décale les icônes de leur position.

---

## Fichier 2 : `js/uiRenderer.js`

### Ajouter deux méthodes publiques à la classe `UIRenderer`

Placer ces deux méthodes dans une section logique existante (ex. après `_renderRevealedIcons()`) :

```js
/**
 * Démarre la pulsation de tous les hotspot-icons visibles.
 * Appelé au début du Stage 2. Décalage de phase entre icônes pour effet vague.
 */
startHotspotPulse() {
  const icons = document.querySelectorAll('#iconsLayer .hotspot-icon');
  icons.forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.22}s`;
    icon.classList.add('pulsing');
  });
}

/**
 * Arrête la pulsation de tous les hotspot-icons.
 * Appelé après le premier clic réussi en Stage 2.
 */
stopHotspotPulse() {
  const icons = document.querySelectorAll('#iconsLayer .hotspot-icon');
  icons.forEach(icon => {
    icon.classList.remove('pulsing');
    icon.style.animationDelay = '';
  });
}
```

---

## Fichier 3 : `js/app.js`

### 3a. Démarrer la pulsation à l'entrée du Stage 2

Localiser le bloc `if (stage === 2)` dans `_beginOralChallenge()` (environ ligne 979).

**Ajouter** l'appel à `startHotspotPulse()` à l'intérieur de ce bloc, après la logique existante :

```js
if (stage === 2) {
  // ... logique existante ...

  // Pulse tous les hotspots pour guider le premier clic
  this.uiRenderer.startHotspotPulse();
}
```

### 3b. Arrêter la pulsation au premier clic réussi en Stage 2

Localiser le handler de succès du Stage 2 dans `_resolveOralChallenge()` ou l'équivalent — l'endroit où un clic correct est enregistré et où `challenge.currentIndex` est incrémenté.

**Ajouter** la condition suivante, qui arrête la pulsation uniquement au tout premier succès de Stage 2 :

```js
if (challenge.stage === 2 && challenge.currentIndex === 1) {
  // Premier clic réussi en Stage 2 : arrêter la pulsation
  this.uiRenderer.stopHotspotPulse();
}
```

> **Note :** `challenge.currentIndex === 1` est vérifié **après** l'incrémentation (`challenge.currentIndex += 1`), donc il correspond bien au premier clic réussi (0 → 1).

---

## Récapitulatif des changements

| Fichier | Quoi | Où |
|---|---|---|
| `css/style.css` | `@keyframes hotspotPulse` + `.hotspot-icon.pulsing` | Fin du fichier |
| `js/uiRenderer.js` | `startHotspotPulse()` + `stopHotspotPulse()` | Après `_renderRevealedIcons()` |
| `js/app.js` | Appel `startHotspotPulse()` | Dans `if (stage === 2)` de `_beginOralChallenge()` |
| `js/app.js` | Appel `stopHotspotPulse()` | Premier succès dans le handler de clic de Stage 2 |

---

## Test de validation

1. Compléter Stage 1 (révéler les 5 hotspots).
2. Vérifier qu'au démarrage de Stage 2, les 5 checkmarks pulsent en vague.
3. Cliquer correctement sur le premier hotspot demandé → la pulsation doit s'arrêter immédiatement.
4. Les stages suivants (3, 4…) ne doivent **pas** déclencher de pulsation.
5. Vérifier qu'un clic incorrect en Stage 2 ne stoppe **pas** la pulsation (elle doit continuer jusqu'au premier succès).
