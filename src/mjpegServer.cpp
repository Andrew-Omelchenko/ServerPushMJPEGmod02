/*
************************************************************************
** Copyright 2011 Samsung Techwin Co. Ltd. all right reserved.        **
**                                                                    **
** This software is the property of Samsung Techwin and is furnished  **
** under license by Samsung Techwin. This software may be used only   **
** in accordance with the terms of said license. This copyright notice**
** may not be removed, modified or obliterated without the prior      **
** written permission of Samsung Techwin.                             **
**                                                                    **
** This software may not be copied, transmitted, provided to or       **
** otherwise made available to any other person, company, corporation **
** or other entity except as specified in the terms of said  license. **
**                                                                    **
** No right, title, ownership or other interest in the software is    **
** hereby granted or transferred.                                     **
**                                                                    **
** The information contained herein is subject to change without      **
** notice and should not be construed as a commitment by              **
** Samsung Techwin.                                                   **
************************************************************************
************************************************************************
*/
/*
**********************************************************************
*@    Module name       : Server Push MJPEG application              *
*@    File name         : mjpegServer.cpp                            *
*@    Description       : Server Push MJPEG sample application       *
*@    Author Name       : Nagarajan Narayanan                        *
*@    Version           : 0.1 Date :30 Oct 2012                      *
*@    Reviewed by       :                                            *
*@                                                                   *
**********************************************************************
*/
#include "mjpegServer.h"

// Global static pointer used to ensure a single instance of MJPEGSERVER
MJPEGSERVER *MJPEGSERVER::m_pInstance = NULL;

/**
*@ ********************************************************************
*@ Name           : constructor                                       *
*@ Description    : Server Push MJPEG constructor                     *
*@ Arguments      : N/A                                               *
*@ Return Value   : N/A                                               *
*@ Notes          :                                                   *
*@ Change History :                                                   *
*@ ********************************************************************
**/
MJPEGSERVER::MJPEGSERVER()
{
    for(int i = 0; i < MAX_CLIENT; i++)
        m_bIsconnected[i] = false;
}

/**
*@ ********************************************************************
*@ Name           : destructor                                        *
*@ Description    : Server Push MJPEG Destructor                      *
*@ Arguments      : N/A                                               *
*@ Return Value   : N/A                                               *
*@ Notes          :                                                   *
*@ Change History :                                                   *
*@ ********************************************************************
**/
MJPEGSERVER::~MJPEGSERVER()
{
    
}

/**
*@ ********************************************************************
*@ Name           : get_instance                                      *
*@ Description    : Server Push singleton implementation              *
*@ Arguments      : N/A                                               *
*@ Return Value   : Instance of MJPEGSERVER calss                     *
*@ Notes          :                                                   *
*@ Change History :                                                   *
*@ ********************************************************************
**/
MJPEGSERVER *MJPEGSERVER::get_instance(void)
{
   return m_pInstance;
}

/**
*@ ********************************************************************
*@ Name           : create_instance                                   *
*@ Description    : Server Push singleton implementation              *
*@ Arguments      : N/A                                               *
*@ Return Value   : Instance of MJPEGSERVER calss                     *
*@ Notes          :                                                   *
*@ Change History :                                                   *
*@ ********************************************************************
**/
MJPEGSERVER *MJPEGSERVER::create_instance(void)
{
    if(m_pInstance == NULL) {
        //Create single instance of MJPEGSERVER
        m_pInstance = new MJPEGSERVER();
    }
    
    return m_pInstance;
}

/**
*@ ********************************************************************
*@ Name           : delete_instance                                   *
*@ Description    : Destroy Server Push singleton class               *
*@ Arguments      : N/A                                               *
*@ Return Value   : N/A                                               *
*@ Notes          :                                                   *
*@ Change History :                                                   *
*@ ********************************************************************
**/
void MJPEGSERVER::delete_instance(void)
{
    if(m_pInstance) {
        //delete single instance of MJPEGSERVER
        delete m_pInstance;
		m_pInstance = NULL;
    }
	
    return;
}

/**
*@ ********************************************************************
*@ Name           : process_jpeg_Image                                *
*@ Description    : Process image received from camera                *
*@ Arguments      : img[IN]  : JPEG image                             *
*@                : size[IN] : Size of image                          *
*@ Return Value   : true/false                                        *
*@ Notes          :                                                   *
*@ Change History :                                                   *
*@ ********************************************************************
**/
bool MJPEGSERVER::process_jpeg_image(char* img, 
                                 int size)
{
    char  buffer[MAX_BOUNDARY_LEN];
    char  buffer1[] = "\r\n";

    for(int client = 0; client < MAX_CLIENT; client++) {
        //Check client is connected or not
        if(m_bIsconnected[client] == true) {
            //Initialize the buffer value with zero
            memset(buffer, NULL, MAX_BOUNDARY_LEN);
            
            //Fill the header
            sprintf(buffer,
                    "\r\n--boundary\r\nContent-Type: image/jpeg\r\nContent-Length: %d\r\n\r\n",
                    size);
					
            //Send the header to Client
            send_data(buffer, strlen(buffer), client);
             
            //Send the jpeg Image
            send_data(img, size, client);
             
            //Send eof info
            send_data(buffer1, strlen(buffer1), client);
        }
    }
	
    return true;
}

/**
*@ ********************************************************************
*@ Name           : manage_new_client                                 *
*@ Description    : Manage new client connected                       *
*@ Arguments      : ipAddress[IN]  : Client IP Address                *
*@ Return Value   : true/false                                        *
*@ Notes          :                                                   *
*@ Change History :                                                   *
*@ ********************************************************************
**/
bool MJPEGSERVER::manage_new_client(char* ipAddress,
                                    int portNo,
                                    int client_id)
{
    debug_message("New client IP address %s\t port%d\t ID%d\n", 
            ipAddress, 
            portNo, 
            client_id);
            
    return true;
}

/**
*@ ********************************************************************
*@ Name           : close_client                                      *
*@ Description    : Close client connection                           *
*@ Arguments      : ipAddress[IN]  : Client IP Address                *
*@ Return Value   : true/false                                        *
*@ Notes          :                                                   *
*@ Change History :                                                   *
*@ ********************************************************************
**/
bool MJPEGSERVER::close_client(int client_id)
{
    debug_message("Clien ID%d closed\n", client_id);
            
    m_bIsconnected[client_id] = false;
            
    return true;
}

bool MJPEGSERVER::process_request(OPENSDK_NETWORK_PACKET* pPacket)
{
    bool flag;
    char buffer[MAX_BOUNDARY_LEN];
    
    //Initizile the local variable
    flag = true;

    //Initialize the buffer value with zero
    memset(buffer, NULL, MAX_BOUNDARY_LEN);
    
    //Check for livemjpeg request
    if (strstr(pPacket->buff, "GET /livemjpeg") != NULL) {
        debug_message("Live server push MJPEG request\n");
        
        //Create response for client 
        sprintf(buffer, "HTTP/1.1 200 OK\r\n"
            "Content-Type: multipart/x-mixed-replace; boundary=--boundary\r\n");
        
        //Send the header to Client
        send_data(buffer, strlen(buffer), pPacket->client_id);
        
        sleep(1);
		
        //Set client ID state to true;
        m_bIsconnected[pPacket->client_id] = true;
    } else {
        debug_message("Unsupported format\n");
        flag = false;
    }
    
    return flag;
}

/**
*@ ********************************************************************
*@ Name           : send_data                                         *
*@ Description    : send response to client                           *
*@ Arguments      : response[IN]: Response to client                  *
*@                : len[IN]     : Length of response                  *
*@ Return Value   : NILL                                              *
*@ Notes          :                                                   *
*@ Change History :                                                   *
*@ ********************************************************************
**/
void MJPEGSERVER::send_data(char* response, 
                           int len,
                           int client_id)
{
    OPENSDK_NETWORK_PACKET pPacket;
    
    //Create network packet
    pPacket.buff      = response;
    pPacket.size      = len;
    pPacket.client_id = client_id;
    
    //Send response to client
	OPENSDK::EVENT::send_event(OPENSDK_SEND_DATA,NULL, (void*)&pPacket,sizeof(OPENSDK_NETWORK_PACKET));

    return;
}

