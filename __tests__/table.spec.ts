import {Table} from '../src/table';
export default describe('table test', () => {
    it('Create table', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const table = new Table(div, {
            data: [],
            col_header: [],
        });

        expect(div).toBeDefined();
    });
});
