import validationService from './validationService';

describe('validationService', () => {

  it('Gibt true zurück, wenn keine Felder benötigt werden', () => {
    const result = validationService.hasRequiredFields({}, [], []);
    expect(result).toBe(true);
  });

  it('Gibt true zurück, wenn alle Felder vorhanden sind', () => {
    const result = validationService.hasRequiredFields({ title: 'Wäsche aufhängen', text: 'Dienstag'}, ['title', 'text'], []);
    expect(result).toBe(true);
  });

  it('Gibt ein false zurück, wenn eines der Felder nicht vorhanden ist', () => {
    const result = validationService.hasRequiredFields({ title: 'Wäsche aufhängen' }, ['title', 'text'], []);
    expect(result).toBe(false);
  });

  it('Gibt true zurück, wenn alle Felder vorhanden sind, ignoriert optionale Felder', () => {
    const result = validationService.hasRequiredFields({ title: 'Wäsche aufhängen', text: 'Dienstag', optionalField: 1}, ['title', 'text'], []);
    expect(result).toBe(true);
  });

});

