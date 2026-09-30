import React from "react";
import { Header } from "../dist/Header";
import { sectionName } from "./sectionName";
import { getStoryFactory } from "./getStory";
import "./utils.css";
import sgeGouvImgUrl from "../src/assets/sge-gouv.png";

const identity = {
    imgUrl: sgeGouvImgUrl,
    alt: "République d'SGE",
    institution: "Gouvernement"
};

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { "MainNavigation": Header },
    "description": `
- [See source code](https://github.com/skygenesisenterprise/react-sds/tree/main/src/MainNavigation)

This component isn't meant to be used directly but via the [\\<Header \\/\\>](https://skygenesisenterprise.github.io/react-sds/?path=/docs/components-header)`,
    "argTypes": {
        "identity": {
            "control": { "type": null }
        },
        "homeLinkProps": {
            "control": { "type": null }
        }
    },
    "disabledProps": ["lang"],
    "doHideImportInstruction": true
});

export default meta;

export const DirectLinks = getStory({
    "identity": identity,
    "homeLinkProps": {
        "href": "/",
        "title": "Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)"
    },
    "navigation": [
        {
            "text": "accès direct",
            "linkProps": {
                "href": "#",
                "target": "_self"
            }
        },
        {
            "text": "accès direct",
            "linkProps": {
                "href": "#",
                "target": "_self"
            },
            "isActive": true
        },
        {
            "text": "accès direct",
            "linkProps": {
                "href": "#",
                "target": "_self"
            }
        },
        {
            "text": "accès direct",
            "linkProps": {
                "href": "#",
                "target": "_self"
            }
        }
    ],
    "id": "story-direct-links"
});

export const DropdownMenu = getStory({
    "className": "margin-bottom-300px",
    "identity": identity,
    "homeLinkProps": {
        "href": "/",
        "title": "Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)"
    },
    "navigation": [
        {
            "text": "Entrée menu active",
            "isActive": true,
            "menuLinks": [
                {
                    "text": "Lien de navigation",
                    "linkProps": {
                        "href": "#"
                    }
                },
                {
                    "text": "Lien de navigation",
                    "linkProps": {
                        "href": "#"
                    }
                },
                {
                    "text": "Lien de navigation",
                    "linkProps": {
                        "href": "#"
                    }
                },
                {
                    "text": "Lien de navigation",
                    "linkProps": {
                        "href": "#"
                    },
                    "isActive": true
                },
                {
                    "text": "Lien de navigation",
                    "linkProps": {
                        "href": "#"
                    }
                },
                {
                    "text": "Lien de navigation",
                    "linkProps": {
                        "href": "#"
                    }
                }
            ]
        },
        {
            "text": "accès direct",
            "menuLinks": [
                {
                    "text": "Lien de navigation",
                    "linkProps": {
                        "href": "#"
                    }
                },
                {
                    "text": "Lien de navigation",
                    "linkProps": {
                        "href": "#"
                    }
                },
                {
                    "text": "Lien de navigation",
                    "linkProps": {
                        "href": "#"
                    }
                },
                {
                    "text": "Lien de navigation",
                    "linkProps": {
                        "href": "#"
                    }
                },
                {
                    "text": "Lien de navigation",
                    "linkProps": {
                        "href": "#"
                    }
                },
                {
                    "text": "Lien de navigation",
                    "linkProps": {
                        "href": "#"
                    }
                }
            ]
        },
        {
            "text": "accès direct",
            "linkProps": {
                "href": "#",
                "target": "_self"
            }
        },
        {
            "text": "accès direct",
            "linkProps": {
                "href": "#",
                "target": "_self"
            }
        }
    ],
    "id": "story-dropdown-menu"
});

export const MegaMenu = getStory({
    "className": "margin-bottom-600px",
    "identity": identity,
    "homeLinkProps": {
        "href": "/",
        "title": "Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)"
    },
    "navigation": [
        {
            "text": "Entrée mega menu",
            "isActive": true,
            "megaMenu": {
                "leader": {
                    "title": "Titre éditorialisé",
                    "paragraph": "Lorem [...] elit ut.",
                    "link": {
                        "text": "Voir toute la rubrique",
                        "linkProps": {
                            "href": "#"
                        }
                    }
                },
                "categories": [
                    {
                        "categoryMainLink": {
                            "text": "Nom de catégorie",
                            "linkProps": {
                                "href": "#"
                            }
                        },
                        "links": [
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Page active",
                                "linkProps": {
                                    "href": "#"
                                },
                                "isActive": true
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            }
                        ]
                    },
                    {
                        "categoryMainText": "Nom de catégorie sans lien",
                        "links": [
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            }
                        ]
                    },
                    {
                        "categoryMainLink": {
                            "text": "Nom de catégorie",
                            "linkProps": {
                                "href": "#"
                            }
                        },
                        "links": [
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                },
                                "isActive": true
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            }
                        ]
                    },
                    {
                        "categoryMainLink": {
                            "text": "Nom de catégorie",
                            "linkProps": {
                                "href": "#"
                            }
                        },
                        "links": [
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "text": "Entrée mega menu",
            "megaMenu": {
                "leader": {
                    "title": "Titre éditorialisé",
                    "paragraph": "Lorem [...] elit ut.",
                    "link": {
                        "text": "Voir toute la rubrique",
                        "linkProps": {
                            "href": "#"
                        }
                    }
                },
                "categories": [
                    {
                        "categoryMainLink": {
                            "text": "Nom de catégorie",
                            "linkProps": {
                                "href": "#"
                            }
                        },
                        "links": [
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            }
                        ]
                    },
                    {
                        "categoryMainLink": {
                            "text": "Nom de catégorie",
                            "linkProps": {
                                "href": "#"
                            }
                        },
                        "links": [
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            }
                        ]
                    },
                    {
                        "categoryMainLink": {
                            "text": "Nom de catégorie",
                            "linkProps": {
                                "href": "#"
                            }
                        },
                        "links": [
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                },
                                "isActive": true
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            }
                        ]
                    },
                    {
                        "categoryMainLink": {
                            "text": "Nom de catégorie",
                            "linkProps": {
                                "href": "#"
                            }
                        },
                        "links": [
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            },
                            {
                                "text": "Lien de navigation",
                                "linkProps": {
                                    "href": "#"
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "text": "accès direct",
            "linkProps": {
                "href": "#",
                "target": "_self"
            }
        },
        {
            "text": "accès direct",
            "linkProps": {
                "href": "#",
                "target": "_self"
            }
        }
    ],
    "id": "story-mega-menu"
});
