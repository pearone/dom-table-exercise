import {TableDom} from '../src/table-dom';

export default describe('dom test', () => {
    it('Use table dom', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const table = new TableDom({});

        expect(div).toBeDefined();
    });
});
