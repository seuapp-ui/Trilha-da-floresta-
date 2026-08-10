/**
 * UI.js
 * -----------------------------------------------------------------------
 * Small reusable UI factory helpers (buttons, panels, titles) shared by
 * every menu-like scene, so screens stay short and visually consistent.
 * -----------------------------------------------------------------------
 */
export const UI = {
  button(scene, x, y, label, onClick, opts = {}) {
    const width = opts.width || 220;
    const height = opts.height || 52;
    const container = scene.add.container(x, y);

    const bg = scene.add.rectangle(0, 0, width, height, opts.color ?? 0x3f8f4f, 1)
      .setStrokeStyle(3, 0x2e6b3b)
      .setInteractive({ useHandCursor: true });

    const text = scene.add.text(0, 0, label, {
      fontFamily: 'Arial, sans-serif',
      fontSize: opts.fontSize || '22px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    container.add([bg, text]);
    container.setSize(width, height);

    bg.on('pointerover', () => bg.setFillStyle(opts.hoverColor ?? 0x4fa35a));
    bg.on('pointerout', () => bg.setFillStyle(opts.color ?? 0x3f8f4f));
    bg.on('pointerdown', () => { bg.setScale(0.96); });
    bg.on('pointerup', () => { bg.setScale(1); onClick(); });

    return container;
  },

  title(scene, x, y, label, size = '40px') {
    return scene.add.text(x, y, label, {
      fontFamily: 'Arial, sans-serif',
      fontSize: size,
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#00000080',
      strokeThickness: 6,
    }).setOrigin(0.5);
  },

  panel(scene, x, y, width, height, alpha = 0.55) {
    return scene.add.rectangle(x, y, width, height, 0x1a1a1a, alpha).setStrokeStyle(2, 0xffffff, 0.2);
  },
};
