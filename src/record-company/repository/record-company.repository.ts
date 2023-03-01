export const RECORD_COMPANY_REPOSITORY = 'RecordCompanyRepository';

export interface RecordCompanyRepository {
  findAllRecordCompanies(filter?: string, searchText?: string): Promise<any>;
  getSummaryRecordCompanyById(id: string): Promise<boolean | any>;
  getRecordCompanyByIdKpiRadio(id: string): Promise<boolean | any>;
  getArtistsRecordCompanyById(
    id: string,
    filter?: string,
    searchText?: string,
  ): Promise<boolean | any>;
}
