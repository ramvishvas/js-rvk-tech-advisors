import GUI from 'lil-gui';

class ThreeGUIUtils {
    constructor() {
        this.gui = new GUI({
            title: 'Nice debug UI',
            closeFolders: true,
        });
    }

    // Add a folder to the GUI
    addFolder(name) {
        return this.gui.addFolder(name);
    }

    // Add a parameter to the GUI
    addParameter(object, property, min, max, step) {
        return this.gui.add(object, property, min, max).step(step || 1);
    }

    // Add color parameter to the GUI
    addColorParameter(object, property) {
        return this.gui.addColor(object, property);
    }

    // Add checkbox to the GUI
    addCheckbox(object, property) {
        return this.gui.add(object, property);
    }

    // Add text to the GUI
    addText(text) {
        return this.gui.add({ text: text }, 'text').name(text);
    }

    // Add button to the GUI
    addButton(label, callback) {
        return this.gui.add({ [label]: callback }, label).onChange(callback);
    }
}

export default ThreeGUIUtils;
