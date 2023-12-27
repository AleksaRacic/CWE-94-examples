package com.etf;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


public class App 
{
    private static final Logger logger = LogManager.getLogger(App.class);

    	public static void main(String[] args) {
			String userInput = args[0];
			logger.error(userInput);
    }

}
