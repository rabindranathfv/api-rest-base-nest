export const RECORD_COMPANY_REPOSITORY = 'RecordCompanyRepository';

export interface RecordCompanyRepository {
  findAllRecordCompanies(): Promise<any>;
  getSummaryRecordCompanyById(id: string): Promise<boolean | any>;
  getRecordCompanyByIdKpiRadio(id: string): Promise<boolean | any>;
  getArtistsRecordCompanyById(id: string): Promise<boolean | any>;
}
