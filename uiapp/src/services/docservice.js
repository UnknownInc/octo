import apicall from './api';

export default class DocService {

  static async get(id) {
    const error = {code: 500, message: 'API error.'};
    try {
      const response = await apicall(`/api/doc/$id||'current'}`);
      if (response.ok) {
        return await response.json();
      }

      if (response.status===404) return null;

      error.code=response.status;
      error.message=response.statusText;

    } catch (e) {
      console.error(e);
    }
    throw error;
  }

  static async update(id, values) {
    const error = {code: 500, message: 'API error.'};
    try {
      const response = await apicall(`/api/doc/${id||'current'}`,{
        method: 'POST',
        body: JSON.stringify(values)
      });
      if (response.ok) {
        return await response.json();
      }

      if (response.status===404) return null;

      error.code=response.status;
      error.message=response.statusText;

    } catch (e) {
      console.error(e);
    }
    throw error;
  }
}