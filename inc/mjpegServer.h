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
*@    File name         : mjpegServer.h                              *
*@    Description       : Server Push MJPEG sample application       *
*@    Author Name       : Nagarajan Narayanan                        *
*@    Version           : 0.1 Date :30 Oct 2012                      *
*@    Reviewed by       :                                            *
*@                                                                   *
**********************************************************************
*/

#ifndef _MJPEG_SERVER_H_
#define _MJPEG_SERVER_H_

#include <stdio.h>
#include <stdlib.h>
#include<math.h>
#include <string.h>
#include <sys/time.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <pthread.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <syslog.h>

#include <SDKAPI/opensdk_defines.h>

#define MAX_CLIENT       3
#define MAX_PORT_NO_LEN  10
#define MAX_BOUNDARY_LEN 256

class MJPEGSERVER {
private:
    MJPEGSERVER(void);
    ~MJPEGSERVER();

public:
    //Singleton class
	static MJPEGSERVER *create_instance(void);
	
	//Get the class instance
    static MJPEGSERVER *get_instance(void);	
	
	//Delete the singleton class instance
    static void delete_instance(void);
	
    //Initialize event handler class
    int initialize(void);
	
	//Process image received from SDK
	bool process_jpeg_image(char* img, 
	                        int size);
	
	//Manage the new client connection
	bool manage_new_client(char* ipAddress,
	                       int port,
						   int client_id);

	//Close the client connection
	bool close_client(int client_id);
						   
	//Process client request
	bool process_request(OPENSDK_NETWORK_PACKET* pcaket);

private:
    //Send response to client
	void send_data(char* response, 
                    int len,
					int client_id);
    
private:
    static MJPEGSERVER* m_pInstance;
	bool                m_bIsconnected[MAX_CLIENT];
};

#endif //_MJPEG_SERVER_H_

