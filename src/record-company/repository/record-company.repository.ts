export const RECORD_COMPANY_REPOSITORY = 'RecordCompanyRepository';

export interface RecordCompanyRepository {
  // TODO: Add interface for discographics
  findAllRecordCompanies(queryStr: string): Promise<any>;
  findRecordCompanyById(queryStr: string, id: string): Promise<boolean | any>;
}
