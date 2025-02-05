import path from 'path';
import { saveDocument } from '../src/document';
import { main, Settings } from '../src/main';

const docs: Record<string, string> = {};

jest.mock('../src/document', () => {
	const originalModule = jest.requireActual('../src/document');
	//Mock the default export and named export 'foo'
	return {
	  __esModule: true,
	  ...originalModule,
	  saveDocument: jest.fn((doc: string, content: string) => {
		console.log('Received', doc, content);
		docs[doc] = content;
	  })
	};
});

describe("Sample Test", () => {

	test("will perform a simple update of gandalf", async() => {
		const settings: Settings = {
			folder: path.join(__dirname, 'sample'),
			ignores: []
		}
		await main(settings);

		expect(docs).toMatchSnapshot();
	})
	
});