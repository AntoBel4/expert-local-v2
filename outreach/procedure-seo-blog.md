# Procédure SEO Blog — Expert-Local.fr
> À réaliser demain depuis n'importe quel ordinateur avec Node.js installé.
> Durée estimée : 30-45 minutes.

---

## Prérequis sur le nouvel ordinateur

1. **Node.js** installé (version 18+ recommandée) → https://nodejs.org
2. **Git** installé → https://git-scm.com
3. Accès au repo Git OU avoir copié le dossier `expert-local-v2/` sur une clé USB / cloud

### Si tu utilises Git (recommandé)
```bash
git clone [URL_DE_TON_REPO]
cd expert-local-v2
npm install
```

### Si tu as le dossier en local (clé USB / OneDrive)
```bash
cd chemin/vers/expert-local-v2
npm install
```

---

## Ce qu'on va corriger

| Problème | Impact SEO | Fichier à modifier |
|---------|-----------|-------------------|
| Pas de Schema.org `BlogPosting` | Google ne comprend pas que c'est un article | `src/pages/blog/[...slug].astro` |
| Pas de `BreadcrumbList` Schema | Pas de fil d'Ariane dans les SERPs | `src/pages/blog/[...slug].astro` |
| Pas de liens internes vers offres | PageRank ne circule pas vers la home | `src/pages/blog/[...slug].astro` |
| Accents manquants dans 3 articles | Lisibilité + indexation dégradée | 3 fichiers `.md` |
| `og:type` = `website` sur articles | Facebook/LinkedIn mal prévisualisé | `src/pages/blog/[...slug].astro` |

---

## FIX 1 — Ajouter Schema.org + liens internes au template blog

### Fichier : `src/pages/blog/[...slug].astro`

**Contenu actuel (lignes 1-34) :**
```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="container max-w-3xl py-12 prose dark:prose-invert prose-lg mx-auto">
    <header class="mb-12">
      <h1 class="text-4xl font-bold mb-4 ember-gradient">{post.data.title}</h1>
      <div class="flex items-center gap-4 text-gray-400">
        <span>{post.data.author}</span>
        <span>•</span>
        <span>{post.data.date.toLocaleDateString('fr-FR')}</span>
      </div>
    </header>

    <Content />

    <footer class="mt-12 pt-6 border-t border-gray-800">
      <a href="/blog/" class="text-primary hover:underline">← Retour au blog</a>
    </footer>
  </article>
</BaseLayout>
```

**Remplacer TOUT le fichier par :**
```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);

const siteUrl = 'https://expert-local.fr';
const articleUrl = `${siteUrl}/blog/${post.id}/`;

const schemaArticle = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.data.title,
  "description": post.data.description,
  "image": post.data.image ? `${siteUrl}${post.data.image}` : `${siteUrl}/images/og-image-2026.webp`,
  "datePublished": post.data.date.toISOString(),
  "dateModified": post.data.date.toISOString(),
  "author": {
    "@type": "Person",
    "name": post.data.author ?? "Antoine Estarellas",
    "url": siteUrl
  },
  "publisher": {
    "@type": "Organization",
    "name": "Expert Local",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/favicon.svg`
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": articleUrl
  }
};

const schemaBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": siteUrl + "/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": siteUrl + "/blog/" },
    { "@type": "ListItem", "position": 3, "name": post.data.title, "item": articleUrl }
  ]
};
---

<BaseLayout title={post.data.title} description={post.data.description} ogImage={post.data.image}>
  <script type="application/ld+json" set:html={JSON.stringify(schemaArticle)} />
  <script type="application/ld+json" set:html={JSON.stringify(schemaBreadcrumb)} />

  <article class="container max-w-3xl py-12 prose dark:prose-invert prose-lg mx-auto">

    <!-- Fil d'Ariane -->
    <nav aria-label="Fil d'Ariane" class="mb-8 text-sm text-gray-400 not-prose">
      <a href="/" class="hover:underline">Accueil</a>
      <span class="mx-2">›</span>
      <a href="/blog/" class="hover:underline">Blog</a>
      <span class="mx-2">›</span>
      <span class="text-gray-300">{post.data.title}</span>
    </nav>

    <header class="mb-12">
      <h1 class="text-4xl font-bold mb-4 ember-gradient">{post.data.title}</h1>
      <div class="flex items-center gap-4 text-gray-400">
        <span>{post.data.author ?? 'Antoine Estarellas'}</span>
        <span>•</span>
        <time datetime={post.data.date.toISOString()}>
          {post.data.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </time>
      </div>
    </header>

    <Content />

    <!-- CTA interne vers diagnostic -->
    <aside class="not-prose mt-12 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
      <p class="text-lg font-semibold text-amber-400 mb-2">Votre fiche Google Maps est-elle optimisée ?</p>
      <p class="text-gray-300 mb-4 text-sm">
        Obtenez un diagnostic gratuit en 60 secondes et découvrez combien de chantiers vous perdez chaque semaine faute d'avis Google.
      </p>
      <a href="/#diagnostic" class="inline-block bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2 rounded-lg text-sm transition">
        → Diagnostic gratuit — 60 secondes
      </a>
    </aside>

    <footer class="mt-10 pt-6 border-t border-gray-800 flex flex-wrap gap-4 text-sm not-prose">
      <a href="/blog/" class="text-primary hover:underline">← Tous les articles</a>
      <a href="/chartres/" class="text-gray-400 hover:underline">Artisans Chartres</a>
      <a href="/dreux/" class="text-gray-400 hover:underline">Artisans Dreux</a>
      <a href="/nogent-le-roi/" class="text-gray-400 hover:underline">Artisans Nogent-le-Roi</a>
    </footer>
  </article>
</BaseLayout>
```

---

## FIX 2 — Corriger les accents manquants dans les articles

> Les 3 articles récents ont été écrits sans accents. Ça nuit à la lisibilité
> et potentiellement à l'indexation Google. Voici les corrections article par article.

### Article 1 : `src/content/blog/urgence-plomberie-chartres.md`

Remplace le frontmatter (lignes 1-6) :
```yaml
---
title: "Urgence plomberie a Chartres : l'urgence ne pardonne pas l'invisibilite"
date: 2026-04-06
description: "En 2026, 36% des clients appellent directement depuis Google. Si votre bouton Appeler est invisible, vous perdez des chantiers. Voici comment capter ces urgences a Chartres et en Eure-et-Loir."
image: "/images/urgence-plomberie-chartres.webp"
---
```
Par :
```yaml
---
title: "Urgence plomberie à Chartres : l'urgence ne pardonne pas l'invisibilité"
author: "Antoine Estarellas"
date: 2026-04-06
description: "En 2026, 36% des clients appellent directement depuis Google. Si votre bouton Appeler est invisible, vous perdez des chantiers. Voici comment capter ces urgences à Chartres et en Eure-et-Loir."
image: "/images/urgence-plomberie-chartres.webp"
---
```

Puis dans le corps de l'article, fais un **Rechercher/Remplacer** (Ctrl+H dans VS Code) sur ce fichier uniquement :

| Chercher | Remplacer par |
|---------|--------------|
| `a Chartres` | `à Chartres` |
| `l'invisibilite` | `l'invisibilité` |
| `l'urgence` | `l'urgence` |
| `etude` | `étude` |
| `repondent` | `répondent` |
| `reactivite` | `réactivité` |
| `reponse` | `réponse` |
| `Verifiez` | `Vérifiez` |
| `Verifier` | `Vérifier` |
| `Mettez a jour` | `Mettez à jour` |
| `precis` | `précis` |
| `Demandez a` | `Demandez à` |
| `eviter` | `éviter` |
| `Laissez` | `Laissez` |
| `meme` | `même` |

### Article 2 : `src/content/blog/google-vs-pages-jaunes-2026.md`

Remplace le frontmatter :
```yaml
---
title: "Google vs Pages Jaunes 2026 : pourquoi les annuaires passifs sont des boulets financiers"
author: "Antoine Estarellas"
date: 2026-04-06
description: "En 2026, 69% des recherches d'artisans passent par Google. Les Pages Jaunes ? Un annuaire qui coûte cher et ne rapporte plus. Voici comment basculer vers l'action immédiate."
image: "/images/google-vs-pages-jaunes-2026.webp"
---
```

Rechercher/Remplacer dans ce fichier :

| Chercher | Remplacer par |
|---------|--------------|
| `etude` | `étude` |
| `genere` | `génère` |
| `Resultat` | `Résultat` |
| `immediat` | `immédiat` |
| `immediate` | `immédiate` |
| `Verifiez` | `Vérifiez` |
| `Completez` | `Complétez` |
| `Reallouez` | `Réallouez` |
| `Resiliez` | `Résiliez` |
| `regulierement` | `régulièrement` |
| `credibilite` | `crédibilité` |
| `reference` | `référencé` |

### Article 3 : `src/content/blog/psychologie-avis-artisan-28.md`

Remplace le frontmatter :
```yaml
---
title: "Psychologie des avis clients : transformer le bouche-à-oreille en preuve numérique"
author: "Antoine Estarellas"
date: 2026-04-06
description: "67% des clients vérifient les avis avant d'appeler un artisan. En Eure-et-Loir, un avis positif vaut plus qu'une pub. Voici comment en faire une arme commerciale."
image: "/images/avis-artisan-28.webp"
---
```

Rechercher/Remplacer dans ce fichier :

| Chercher | Remplacer par |
|---------|--------------|
| `etude` | `étude` |
| `electricien` | `électricien` |
| `etoiles` | `étoiles` |
| `Resultat` | `Résultat` |
| `repondent` | `répondent` |
| `repondez` | `répondez` |
| `Repondez` | `Répondez` |
| `negliger` | `négliger` |
| `Negligez` | `Négligez` |
| `regularierement` | `régulièrement` |
| `Demandez` | `Demandez` |
| `credibilite` | `crédibilité` |
| `personnalise` | `personnalisé` |
| `meme` | `même` |

---

## FIX 3 — Ajouter `author` dans les articles qui en manquent

Le champ `author` est absent dans 3 articles sur 4. Le template blog l'affiche (`post.data.author`). Sans lui, l'affichage donne "undefined" et le Schema.org ne contient pas le nom de l'auteur.

**Vérifier** que chaque fichier `.md` dans `src/content/blog/` a bien dans son frontmatter :
```yaml
author: "Antoine Estarellas"
```
(Les corrections des Fix 2 l'incluent déjà dans les frontmatters corrigés ci-dessus.)

---

## Commandes à lancer après les modifications

```bash
# 1. Vérifier que tout compile sans erreur
npm run build

# 2. Prévisualiser en local (optionnel mais recommandé)
npm run preview
# → Ouvre http://localhost:4321/blog/urgence-plomberie-chartres/
# → Clic-droit > Inspecter > chercher "BlogPosting" dans le <head> pour valider Schema.org

# 3. Si tout est OK : zipper le dist/ pour le FTP
# (Windows PowerShell)
Compress-Archive -Path dist\* -DestinationPath deploy-$(Get-Date -Format 'yyyyMMdd').zip
```

---

## Déploiement sur o2switch (rappel)

1. Connecte-toi à **cPanel o2switch**
2. Ouvre **Gestionnaire de fichiers** → `public_html/`
3. Upload le zip `deploy-YYYYMMDD.zip` dans `public_html/`
4. Extraire → écraser les fichiers existants
5. Supprimer le zip après extraction
6. **Vérifier** : ouvre `https://expert-local.fr/blog/urgence-plomberie-chartres/` en navigation privée
7. **Valider Schema.org** : https://search.google.com/test/rich-results (coller l'URL)

---

## Validation finale (checklist)

- [ ] `https://expert-local.fr/blog/urgence-plomberie-chartres/` répond 200
- [ ] Le fil d'Ariane s'affiche sous le header de l'article
- [ ] Le CTA amber "Diagnostic gratuit" apparaît en bas de l'article
- [ ] Les liens "Artisans Chartres / Dreux / Nogent-le-Roi" s'affichent en footer
- [ ] Rich Results Test valide le `BlogPosting` Schema
- [ ] Rich Results Test valide le `BreadcrumbList` Schema
- [ ] Les accents s'affichent correctement dans les titres

---

*Procédure rédigée par Claude Code — expert-local-v2 — 2026-04-15*
