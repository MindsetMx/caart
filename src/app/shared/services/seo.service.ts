import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tag?: string;
  locale?: string;
  siteName?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  robots?: string;
  canonical?: string;
  prev?: string;
  next?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  #meta = inject(Meta);
  #title = inject(Title);
  #document = inject(DOCUMENT);
  #platformId = inject(PLATFORM_ID);

  private readonly defaultConfig: SeoData = {
    title: 'Caart - Subastas de Arte y Automóviles Premium',
    description: 'Descubre subastas exclusivas de arte, automóviles clásicos y memorabilia. Plataforma líder en subastas premium con autenticidad garantizada.',
    keywords: 'subastas, arte, automóviles, carros clásicos, memorabilia, coleccionables, subastas online, vehículos premium',
    image: 'https://caart.com.mx/assets/img/icons/logo2.png',
    url: 'https://caart.com.mx',
    type: 'website',
    siteName: 'Caart',
    locale: 'es_MX',
    twitterCard: 'summary_large_image',
    // twitterSite: '@caart_auctions',
    robots: 'index, follow'
  };

  /**
   * Sets up default SEO configuration for the entire application
   */
  setupDefaultSeo(): void {
    this.updateSeo(this.defaultConfig);
  }

  /**
   * Updates SEO meta tags for a specific page
   */
  updateSeo(seoData: SeoData): void {
    const config = seoData;

    // Set page title
    if (config.title) {
      this.#title.setTitle(config.title);
    }


    // Basic meta tags
    if (config.description) {
      this.#meta.addTag({ name: 'description', content: config.description });
    }
    if (config.keywords) {
      this.#meta.addTag({ name: 'keywords', content: config.keywords });
    }
    if (config.author) {
      this.#meta.addTag({ name: 'author', content: config.author });
    }
    if (config.robots) {
      this.#meta.addTag({ name: 'robots', content: config.robots });
    }

    // Open Graph tags
    if (config.title) {
      this.#meta.addTag({ property: 'og:title', content: config.title });
    }
    if (config.description) {
      this.#meta.addTag({ property: 'og:description', content: config.description });
    }
    if (config.image) {
      this.#meta.addTag({ property: 'og:image', content: config.image });
    }
    if (config.url) {
      this.#meta.addTag({ property: 'og:url', content: config.url });
    }
    if (config.type) {
      this.#meta.addTag({ property: 'og:type', content: config.type });
    }
    if (config.siteName) {
      this.#meta.addTag({ property: 'og:site_name', content: config.siteName });
    }
    if (config.locale) {
      this.#meta.addTag({ property: 'og:locale', content: config.locale });
    }
    if (config.publishedTime) {
      this.#meta.addTag({ property: 'article:published_time', content: config.publishedTime });
    }
    if (config.modifiedTime) {
      this.#meta.addTag({ property: 'article:modified_time', content: config.modifiedTime });
    }
    if (config.section) {
      this.#meta.addTag({ property: 'article:section', content: config.section });
    }
    if (config.tag) {
      this.#meta.addTag({ property: 'article:tag', content: config.tag });
    }

    // Twitter Card tags
    if (config.twitterCard) {
      this.#meta.addTag({ name: 'twitter:card', content: config.twitterCard });
    }
    if (config.title) {
      this.#meta.addTag({ name: 'twitter:title', content: config.title });
    }
    if (config.description) {
      this.#meta.addTag({ name: 'twitter:description', content: config.description });
    }
    if (config.image) {
      this.#meta.addTag({ name: 'twitter:image', content: config.image });
    }
    // if (config.twitterSite) {
    //   this.#meta.addTag({ name: 'twitter:site', content: config.twitterSite });
    // }
    // if (config.twitterCreator) {
    //   this.#meta.addTag({ name: 'twitter:creator', content: config.twitterCreator });
    // }

    // Link tags
    this.updateLinkTags(config);
  }

  /**
   * Updates link tags (canonical, prev, next)
   */
  private updateLinkTags(config: SeoData): void {
    // Remove existing link tags
    this.removeLinkTag('canonical');
    this.removeLinkTag('prev');
    this.removeLinkTag('next');

    // Add new link tags
    if (config.canonical) {
      this.addLinkTag('canonical', config.canonical);
    }
    if (config.prev) {
      this.addLinkTag('prev', config.prev);
    }
    if (config.next) {
      this.addLinkTag('next', config.next);
    }
  }

  /**
   * Adds structured data (JSON-LD) to the page
   */
  addStructuredData(data: StructuredData): void {
    // Remove existing structured data
    this.removeStructuredData();

    const script = this.#document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = 'structured-data';
    this.#document.head.appendChild(script);
  }


  /**
   * Creates auction-specific structured data
   */
  createAuctionStructuredData(auction: any): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: auction.title || 'Subasta Premium',
      description: auction.description || 'Subasta exclusiva en Caart',
      startDate: auction.startDate,
      endDate: auction.endDate,
      location: {
        '@type': 'VirtualLocation',
        url: `https://caart.com/auction/${auction.id}`
      },
      organizer: {
        '@type': 'Organization',
        name: 'Caart',
        url: 'https://caart.com'
      },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        url: `https://caart.com/auction/${auction.id}`,
        priceCurrency: 'MXN'
      }
    };
  }

  /**
   * Creates art-specific structured data
   */
  createArtStructuredData(artwork: any): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'VisualArtwork',
      name: artwork.title || 'Obra de Arte',
      description: artwork.description || 'Obra de arte premium',
      creator: {
        '@type': 'Person',
        name: artwork.artist || 'Artista'
      },
      dateCreated: artwork.dateCreated,
      artMedium: artwork.medium,
      artworkSurface: artwork.surface,
      width: artwork.width,
      height: artwork.height,
      image: artwork.image,
      url: `https://caart.com/art/${artwork.id}`,
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        url: `https://caart.com/art/${artwork.id}`,
        priceCurrency: 'MXN'
      }
    };
  }

  /**
   * Creates vehicle-specific structured data
   */
  createVehicleStructuredData(vehicle: any): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Car',
      name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      description: vehicle.description || 'Vehículo premium en subasta',
      brand: {
        '@type': 'Brand',
        name: vehicle.brand
      },
      model: vehicle.model,
      productionDate: vehicle.year,
      vehicleEngine: {
        '@type': 'EngineSpecification',
        engineType: vehicle.engineType,
        enginePower: vehicle.power
      },
      mileageFromOdometer: {
        '@type': 'QuantitativeValue',
        value: vehicle.mileage,
        unitCode: 'KMT'
      },
      color: vehicle.color,
      image: vehicle.image,
      url: `https://caart.com/vehicle/${vehicle.id}`,
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        url: `https://caart.com/vehicle/${vehicle.id}`,
        priceCurrency: 'MXN'
      }
    };
  }

  /**
   * Creates organization structured data for the company
   */
  createOrganizationStructuredData(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Caart',
      description: 'Plataforma líder en subastas de arte, automóviles y memorabilia premium',
      url: 'https://caart.com',
      logo: 'https://caart.com/assets/img/logo/logo_caart_auctions_blanco.png',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Spanish', 'English']
      },
      sameAs: [
        'https://facebook.com/caart',
        'https://twitter.com/caart_auctions',
        'https://instagram.com/caart_auctions'
      ]
    };
  }

  /**
   * Removes existing meta tags to prevent duplicates
   */
  removeExistingMetas(): void {
    const metaTags = [
      "name='description'",
      "name='keywords'",
      "name='author'",
      "name='robots'",
      "property='og:title'",
      "property='og:description'",
      "property='og:image'",
      "property='og:url'",
      "property='og:type'",
      "property='og:site_name'",
      "property='og:locale'",
      "property='article:published_time'",
      "property='article:modified_time'",
      "property='article:section'",
      "property='article:tag'",
      "name='twitter:card'",
      "name='twitter:title'",
      "name='twitter:description'",
      "name='twitter:image'",
      "name='twitter:site'",
      "name='twitter:creator'"
    ];

    metaTags.forEach(tag => {
      this.#meta.removeTag(tag);
    });
  }

  /**
   * Removes structured data script
   */
  private removeStructuredData(): void {
    const existingScript = this.#document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }
  }

  /**
   * Adds a link tag to the document head
   */
  private addLinkTag(rel: string, href: string): void {
    const link = this.#document.createElement('link');
    link.rel = rel;
    link.href = href;
    this.#document.head.appendChild(link);
  }

  /**
   * Removes a link tag from the document head
   */
  private removeLinkTag(rel: string): void {
    const existing = this.#document.querySelector(`link[rel="${rel}"]`);
    if (existing) {
      existing.remove();
    }
  }

  /**
   * Gets the current page URL for SEO purposes
   */
  getCurrentUrl(): string {
    if (!isPlatformBrowser(this.#platformId)) {
      return 'https://caart.com';
    }
    return window.location.href;
  }

  /**
   * Generates a canonical URL based on the current route
   */
  getCanonicalUrl(path?: string): string {
    const baseUrl = 'https://caart.com';
    if (path) {
      return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    }
    return this.getCurrentUrl();
  }
}
