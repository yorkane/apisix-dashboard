/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

context('Create and Delete Stream Route', () => {
  const data = {
    server_addr: '127.0.0.1',
    server_port: '2000',
    sni: 'test.com',
    remote_addr: '192.168.1.101',
    desc: 'test stream route',
    upstream_node_host: '1.1.1.1',
    upstream_node_port: '80',
    upstream_node_weight: '1',
  };

  beforeEach(() => {
    cy.login();
  });

  it('should create stream route', () => {
    cy.visit('/');
    cy.contains('Stream Route').click();
    cy.contains('Create').click();

    cy.get('#desc').type(data.desc);
    cy.get('#server_addr').type(data.server_addr);
    cy.get('#server_port').type(data.server_port);
    cy.get('#sni').type(data.sni);
    cy.get('#remote_addr').type(data.remote_addr);

    cy.get('#nodes_0_host').type(data.upstream_node_host);
    cy.get('#nodes_0_port').type(data.upstream_node_port);
    cy.get('#nodes_0_weight').clear().type(data.upstream_node_weight);

    cy.contains('Submit').click();
    cy.contains('Create stream route successfully', { timeout: 10000 }).should('exist');
  });

  it('should view and delete stream route', () => {
    cy.visit('/stream_routes/list');
    cy.contains(data.server_addr).should('exist');
    cy.contains(data.server_port).should('exist');
    cy.contains(data.sni).should('exist');

    cy.contains('Delete').click();
    cy.contains('button', 'OK').click();
    cy.contains('Remove stream route successfully', { timeout: 10000 }).should('exist');
    cy.contains(data.server_addr).should('not.exist');
  });
});
