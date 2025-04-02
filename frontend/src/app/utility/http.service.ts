import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for handling HTTP requests with encoded URIs.
 */
export class HttpService {

  private readonly baseURI = environment.baseURL;

  constructor(private http: HttpClient) {}

  /**
   * Encodes a URI for authentication-related endpoints.
   * @param uri - The URI to encode.
   * @returns The encoded URI string.
   */
  private authEncode(uri: string): string {
    return encodeURI(`${this.baseURI}auth/${uri}`);
  }

  /**
   * Encodes a URI for API-related endpoints.
   * @param uri - The URI to encode.
   * @returns The encoded URI string.
   */
  private encodeUri(uri: string): string {
    return encodeURI(`${this.baseURI}api/${uri}`);
  }

  /**
   * Sends a POST request to the specified URI with the provided request body.
   * @param uri - The endpoint URI.
   * @param requestBody - The body of the POST request.
   * @returns An `Observable` of the HTTP response.
   */
  public post(uri: string, requestBody: any): Observable<any> {
    return this.http.post(this.encodeUri(uri), requestBody);
  }

  /**
   * Sends a GET request to the specified URI.
   * @param uri - The endpoint URI.
   * @returns An `Observable` of the HTTP response.
   */
  public get(uri: string): Observable<any> {
    return this.http.get(this.encodeUri(uri));
  }

  /**
   * Sends a PUT request to the specified URI with the provided request body.
   * @param uri - The endpoint URI.
   * @param requestBody - The body of the PUT request.
   * @returns An `Observable` of the HTTP response.
   */
  public put(uri: string, requestBody: any): Observable<any> {
    return this.http.put(this.encodeUri(uri), requestBody);
  }

  /**
   * Sends a DELETE request to the specified URI.
   * @param uri - The endpoint URI.
   * @returns An `Observable` of the HTTP response.
   */
  public delete(uri: string): Observable<any> {
    return this.http.delete(this.encodeUri(uri));
  }

  /**
   * Sends a POST request to an authentication-related endpoint with the provided request body.
   * @param uri - The authentication endpoint URI.
   * @param requestBody - The body of the POST request.
   * @returns An `Observable` of the HTTP response.
   */
  public authPost(uri: string, requestBody: any): Observable<any> {
    return this.http.post(this.authEncode(uri), requestBody);
  }
}
