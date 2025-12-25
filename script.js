/**
 * Générateur de Palettes de Couleurs
 * Basé sur la théorie des couleurs et la psychologie des couleurs
 */

class ColorPaletteGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.lockedColors = { 1: false, 2: false };
        this.color2Enabled = true;
        this.generatePalette();
    }

    initializeElements() {
        // Éléments de contrôle
        this.color1Input = document.getElementById('color1');
        this.color2Input = document.getElementById('color2');
        this.harmonySelect = document.getElementById('harmonyType');
        this.saturationSlider = document.getElementById('saturation');
        this.lightnessSlider = document.getElementById('lightness');
        this.exposureSlider = document.getElementById('exposure');
        this.moodSelect = document.getElementById('mood');
        this.livePreviewCheckbox = document.getElementById('livePreview');

        // Boutons
        this.generateBtn = document.getElementById('generatePalette');
        this.randomizeBtn = document.getElementById('randomize');
        this.toggleColor2Btn = document.getElementById('toggleColor2');
        this.lockBtns = document.querySelectorAll('.lock-btn');
        this.variantBtns = document.querySelectorAll('.btn-variant');

        // Affichage
        this.paletteDisplay = document.getElementById('paletteDisplay');
        this.variantsDisplay = document.getElementById('variantsDisplay');

        // Valeurs d'affichage
        this.saturationValue = document.getElementById('saturationValue');
        this.lightnessValue = document.getElementById('lightnessValue');
        this.exposureValue = document.getElementById('exposureValue');
    }

    bindEvents() {
        // Événements des contrôles
        this.color1Input.addEventListener('change', () => this.handleColorChange());
        this.color2Input.addEventListener('change', () => this.handleColorChange());
        this.harmonySelect.addEventListener('change', () => this.handleControlChange());
        this.saturationSlider.addEventListener('input', () => this.handleSliderChange());
        this.lightnessSlider.addEventListener('input', () => this.handleSliderChange());
        this.exposureSlider.addEventListener('input', () => this.handleSliderChange());
        this.moodSelect.addEventListener('change', () => this.handleControlChange());

        // Boutons
        this.generateBtn.addEventListener('click', () => this.generatePalette());
        this.randomizeBtn.addEventListener('click', () => this.randomizeColors());
        this.toggleColor2Btn.addEventListener('click', () => this.toggleColor2());

        // Boutons de verrouillage
        this.lockBtns.forEach(btn => {
            btn.addEventListener('click', () => this.toggleLock(btn.dataset.color));
        });

        // Boutons de variantes
        this.variantBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => this.generateVariant(index + 1));
        });

        // Mise à jour des valeurs des sliders
        this.updateSliderValues();
    }

    handleColorChange() {
        if (this.livePreviewCheckbox.checked) {
            this.generatePalette();
        }
    }

    handleControlChange() {
        if (this.livePreviewCheckbox.checked) {
            this.generatePalette();
        }
    }

    handleSliderChange() {
        this.updateSliderValues();
        if (this.livePreviewCheckbox.checked) {
            this.generatePalette();
        }
    }

    updateSliderValues() {
        this.saturationValue.textContent = this.saturationSlider.value + '%';
        this.lightnessValue.textContent = this.lightnessSlider.value + '%';
        this.exposureValue.textContent = this.exposureSlider.value + '%';
    }

    toggleColor2() {
        this.color2Enabled = !this.color2Enabled;
        this.color2Input.disabled = !this.color2Enabled;
        this.toggleColor2Btn.textContent = this.color2Enabled ? 'Désactiver' : 'Activer';
        this.toggleColor2Btn.classList.toggle('disabled', !this.color2Enabled);
        
        if (this.livePreviewCheckbox.checked) {
            this.generatePalette();
        }
    }

    toggleLock(colorNumber) {
        this.lockedColors[colorNumber] = !this.lockedColors[colorNumber];
        const btn = document.querySelector(`[data-color="${colorNumber}"]`);
        btn.textContent = this.lockedColors[colorNumber] ? '🔒' : '🔓';
        btn.classList.toggle('locked', this.lockedColors[colorNumber]);
    }

    randomizeColors() {
        if (!this.lockedColors[1]) {
            this.color1Input.value = this.getRandomHexColor();
        }
        if (!this.lockedColors[2] && this.color2Enabled) {
            this.color2Input.value = this.getRandomHexColor();
        }
        this.generatePalette();
    }

    getRandomHexColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }

    // Conversion des couleurs
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatique
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatique
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    }

    hslToHex(h, s, l) {
        const rgb = this.hslToRgb(h, s, l);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    // Génération des harmonies de couleurs
    generateHarmoniousColors(baseColor, harmonyType) {
        const hsl = this.hexToHsl(baseColor);
        const colors = [baseColor];

        switch (harmonyType) {
            case 'analogous':
                colors.push(
                    this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 60) % 360, hsl.s * 0.8, hsl.l * 1.1),
                    this.hslToHex((hsl.h - 60 + 360) % 360, hsl.s * 0.8, hsl.l * 0.9)
                );
                break;

            case 'complementary':
                colors.push(
                    this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
                    this.hslToHex(hsl.h, hsl.s * 0.6, hsl.l * 1.2),
                    this.hslToHex((hsl.h + 180) % 360, hsl.s * 0.6, hsl.l * 0.8),
                    this.hslToHex(hsl.h, hsl.s * 0.3, hsl.l * 1.4)
                );
                break;

            case 'triadic':
                colors.push(
                    this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
                    this.hslToHex(hsl.h, hsl.s * 0.7, hsl.l * 1.1),
                    this.hslToHex((hsl.h + 120) % 360, hsl.s * 0.7, hsl.l * 0.9)
                );
                break;

            case 'tetradic':
                colors.push(
                    this.hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l),
                    this.hslToHex(hsl.h, hsl.s * 0.6, hsl.l * 1.2)
                );
                break;

            case 'monochromatic':
            default:
                colors.push(
                    this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l * 1.3, 90)),
                    this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l * 0.7, 10)),
                    this.hslToHex(hsl.h, Math.min(hsl.s * 1.2, 100), hsl.l),
                    this.hslToHex(hsl.h, Math.max(hsl.s * 0.5, 10), hsl.l)
                );
                break;
        }

        return colors;
    }

    // Ajustement selon l'ambiance
    adjustForMood(colors, mood) {
        return colors.map(color => {
            const hsl = this.hexToHsl(color);
            
            switch (mood) {
                case 'calm':
                    return this.hslToHex(hsl.h, Math.max(hsl.s * 0.7, 20), Math.min(hsl.l * 1.1, 80));
                case 'dramatic':
                    return this.hslToHex(hsl.h, Math.min(hsl.s * 1.3, 100), Math.max(hsl.l * 0.6, 15));
                case 'joyful':
                    return this.hslToHex(hsl.h, Math.min(hsl.s * 1.2, 100), Math.min(hsl.l * 1.2, 85));
                case 'neutral':
                default:
                    return color;
            }
        });
    }

    // Application des paramètres utilisateur
    applyUserSettings(colors) {
        const saturation = parseInt(this.saturationSlider.value);
        const lightness = parseInt(this.lightnessSlider.value);
        const exposure = parseInt(this.exposureSlider.value);

        return colors.map(color => {
            const hsl = this.hexToHsl(color);
            
            // Ajustement de la saturation
            let newS = (hsl.s * saturation) / 100;
            newS = Math.max(5, Math.min(100, newS));
            
            // Ajustement de la luminosité
            let newL = (hsl.l * lightness) / 50;
            newL = Math.max(5, Math.min(95, newL));
            
            // Ajustement de l'exposition
            const exposureAdjustment = (exposure - 50) / 50;
            newL = newL + (exposureAdjustment * 20);
            newL = Math.max(5, Math.min(95, newL));
            
            return this.hslToHex(hsl.h, newS, newL);
        });
    }

    // Génération de la palette principale
    generatePalette() {
        let baseColors = [this.color1Input.value];
        
        if (this.color2Enabled) {
            baseColors.push(this.color2Input.value);
        }

        const harmonyType = this.harmonySelect.value;
        const mood = this.moodSelect.value;

        // Génération des couleurs harmonieuses
        let allColors = [];
        baseColors.forEach(color => {
            const harmonious = this.generateHarmoniousColors(color, harmonyType);
            allColors = allColors.concat(harmonious);
        });

        // Suppression des doublons
        allColors = [...new Set(allColors)];

        // Ajustement selon l'ambiance
        allColors = this.adjustForMood(allColors, mood);

        // Application des paramètres utilisateur
        allColors = this.applyUserSettings(allColors);

        // Limitation à 5 couleurs et application de la règle 60-30-10
        const finalPalette = this.applyColorRoles(allColors.slice(0, 5));

        this.displayPalette(finalPalette);
    }

    // Application de la règle 60-30-10
    applyColorRoles(colors) {
        const roles = ['Dominante', 'Secondaire', 'Accent', 'Support', 'Emphasis'];
        const percentages = ['60%', '30%', '10%', '5%', '5%'];

        return colors.map((color, index) => ({
            color,
            role: roles[index] || 'Support',
            percentage: percentages[index] || '5%'
        }));
    }

    // Affichage de la palette
    displayPalette(palette) {
        this.paletteDisplay.innerHTML = '';

        palette.forEach(item => {
            const colorCard = this.createColorCard(item.color, item.role, item.percentage);
            this.paletteDisplay.appendChild(colorCard);
        });
    }

    // Création d'une carte de couleur
    createColorCard(color, role, percentage) {
        const card = document.createElement('div');
        card.className = 'color-card';
        
        card.innerHTML = `
            <div class="color-preview" style="background-color: ${color}">
                <div class="color-hex" onclick="copyToClipboard('${color}')">${color.toUpperCase()}</div>
            </div>
            <div class="color-info">
                <div class="color-role">${role}</div>
                <div class="color-percentage">${percentage}</div>
            </div>
        `;

        return card;
    }

    // Génération de variantes
    generateVariant(variantNumber) {
        const baseHue1 = this.hexToHsl(this.color1Input.value).h;
        const baseHue2 = this.color2Enabled ? this.hexToHsl(this.color2Input.value).h : baseHue1;
        
        let colors = [];
        const saturation = 70 + (variantNumber * 10);
        const lightness = 50 + (variantNumber * 5);

        for (let i = 0; i < 5; i++) {
            const hue = (baseHue1 + (i * 30) + (variantNumber * 20)) % 360;
            colors.push(this.hslToHex(hue, saturation, lightness));
        }

        this.displayVariant(variantNumber, colors);
    }

    // Affichage d'une variante
    displayVariant(variantNumber, colors) {
        const existingVariant = document.querySelector(`#variant-${variantNumber}`);
        if (existingVariant) {
            existingVariant.remove();
        }

        const variantDiv = document.createElement('div');
        variantDiv.className = 'variant-palette';
        variantDiv.id = `variant-${variantNumber}`;
        
        const colorsHtml = colors.map(color => 
            `<div class="variant-color" style="background-color: ${color}" onclick="copyToClipboard('${color}')" title="${color}">
                ${color.substring(1).toUpperCase()}
            </div>`
        ).join('');

        variantDiv.innerHTML = `
            <h4>Variante ${variantNumber}</h4>
            <div class="variant-colors">${colorsHtml}</div>
        `;

        this.variantsDisplay.appendChild(variantDiv);
    }
}

// Fonction pour copier dans le presse-papiers
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(`Couleur ${text} copiée !`);
    });
}

// Affichage des notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'copied-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    new ColorPaletteGenerator();
});