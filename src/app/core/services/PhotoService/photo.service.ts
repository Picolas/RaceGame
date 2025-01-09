import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class PhotoService {
	private readonly EXALT_DOMAINS = ['@exalt-company.com', '@exalt-it.com'];

	getPhotoUrlFromInput(input: string): string {
		if (!input || !this.EXALT_DOMAINS.some(domain => input.includes(domain))) {
			return input;
		}

		const email = input.toLowerCase();
		return `https://exaltcompany.sharepoint.com//_layouts/15/userphoto.aspx?size=L&username=${email}`;
	}
}
